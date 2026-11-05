import { Body, Controller, Get, HttpStatus, Logger, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

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
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const expectedToken = this.whatsAppService.getWebhookVerifyToken();

    if (mode === 'subscribe' && token === expectedToken) {
      this.logger.log(`WhatsApp webhook verified successfully. Challenge: ${challenge}`);
      return res.status(HttpStatus.OK).send(challenge);
    }

    this.logger.warn(
      `WhatsApp webhook verification failed. Received mode: "${mode}", token: "${token}". Expected token: "${expectedToken}"`,
    );
    return res.status(HttpStatus.FORBIDDEN).send('Verification token mismatch');
  }

  /**
   * Endpoint for Meta WhatsApp events (message delivery receipts, read receipts, incoming messages).
   * Must always respond with HTTP 200 to acknowledge receipt.
   */
  @Post()
  handleWebhook(@Body() body: Record<string, unknown>, @Res() res: Response) {
    this.whatsAppService.handleIncomingWebhook(body);
    return res.status(HttpStatus.OK).send('EVENT_RECEIVED');
  }
}
