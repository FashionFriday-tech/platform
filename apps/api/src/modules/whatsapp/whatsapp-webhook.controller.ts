import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  Logger,
  Post,
  Query,
} from '@nestjs/common';

import { WhatsAppService } from './whatsapp.service';

@Controller('webhooks/whatsapp')
export class WhatsAppWebhookController {
  private readonly logger = new Logger(WhatsAppWebhookController.name);

  constructor(private readonly whatsAppService: WhatsAppService) {}

  /**
   * Endpoint for Meta Webhook Verification.
   * Meta sends GET request with hub.mode, hub.verify_token, and hub.challenge.
   * If token matches, we must respond with HTTP 200 and the hub.challenge value as the response body.
   */
  @Get()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @Header('X-Content-Type-Options', 'nosniff')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    const expectedToken = this.whatsAppService.getWebhookVerifyToken();

    if (mode === 'subscribe' && token === expectedToken) {
      if (typeof challenge === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(challenge)) {
        this.logger.log('WhatsApp webhook verified successfully.');
        return challenge;
      }

      this.logger.warn('WhatsApp webhook verification rejected: Invalid challenge format.');
      throw new BadRequestException('Invalid challenge');
    }

    this.logger.warn(
      `WhatsApp webhook verification failed. Received mode: "${mode}", token: "${token}". Expected token: "${expectedToken}"`,
    );
    throw new ForbiddenException('Verification token mismatch');
  }

  /**
   * Endpoint for Meta WhatsApp events (message delivery receipts, read receipts, incoming messages).
   * Must always respond with HTTP 200 to acknowledge receipt.
   */
  @Post()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  handleWebhook(@Body() body: Record<string, unknown>): string {
    this.whatsAppService.handleIncomingWebhook(body);
    return 'EVENT_RECEIVED';
  }
}
