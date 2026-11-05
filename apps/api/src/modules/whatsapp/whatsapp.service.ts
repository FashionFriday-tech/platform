import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Normalizes phone numbers to standard international format without '+' for Meta WhatsApp Cloud API.
 * For example, '+91 98765 43210' -> '919876543210'.
 * Defaults 10-digit Indian numbers to '91' prefix.
 */
export function formatWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

interface WhatsAppStatusUpdate {
  id?: string;
  status?: string;
  recipient_id?: string;
  errors?: unknown;
}

interface WhatsAppReceivedMessage {
  from?: string;
  id?: string;
  timestamp?: string;
  type?: string;
}

interface WhatsAppChangeValue {
  messaging_product?: string;
  statuses?: WhatsAppStatusUpdate[];
  messages?: WhatsAppReceivedMessage[];
}

interface WhatsAppWebhookEntry {
  id?: string;
  changes?: {
    field?: string;
    value?: WhatsAppChangeValue;
  }[];
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Returns the configured webhook verify token or a secure default for initial setup verification.
   */
  getWebhookVerifyToken(): string {
    return (
      this.configService.get<string>('WHATSAPP_WEBHOOK_VERIFY_TOKEN') ||
      this.configService.get<string>('META_WHATSAPP_VERIFY_TOKEN') ||
      'fashionfriday_wa_verify_2026'
    );
  }

  /**
   * Dispatches an OTP verification code via Meta WhatsApp Cloud API.
   */
  async sendOtp(phone: string, otp: string): Promise<WhatsAppSendResult> {
    const phoneNumberId =
      this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID') ||
      this.configService.get<string>('META_WHATSAPP_PHONE_NUMBER_ID');
    const accessToken =
      this.configService.get<string>('WHATSAPP_ACCESS_TOKEN') ||
      this.configService.get<string>('META_WHATSAPP_ACCESS_TOKEN');
    const apiVersion = this.configService.get<string>('WHATSAPP_API_VERSION') || 'v21.0';
    const templateName =
      this.configService.get<string>('WHATSAPP_OTP_TEMPLATE_NAME') || 'otp_verification';
    const templateLang = this.configService.get<string>('WHATSAPP_OTP_TEMPLATE_LANG') || 'en';
    const templateStyle = this.configService.get<string>('WHATSAPP_TEMPLATE_STYLE') || 'body'; // 'body' | 'copy_code' | 'url' | 'text'

    if (!phoneNumberId || !accessToken) {
      this.logger.warn(
        `[WhatsAppService] Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN. OTP ${otp} not sent via WhatsApp to ${phone}.`,
      );
      return {
        success: false,
        error: 'WhatsApp API credentials not configured in environment',
      };
    }

    const formattedRecipient = formatWhatsAppPhone(phone);
    const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    // Construct components based on template style
    const components: Record<string, unknown>[] = [
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: otp,
          },
        ],
      },
    ];

    if (templateStyle === 'copy_code') {
      components.push({
        type: 'button',
        sub_type: 'copy_code',
        index: '0',
        parameters: [
          {
            type: 'coupon_code',
            coupon_code: otp,
          },
        ],
      });
    } else if (templateStyle === 'url') {
      components.push({
        type: 'button',
        sub_type: 'url',
        index: '0',
        parameters: [
          {
            type: 'text',
            text: otp,
          },
        ],
      });
    }

    let payload: Record<string, unknown>;

    if (templateStyle === 'text') {
      // Direct session text message fallback
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedRecipient,
        type: 'text',
        text: {
          preview_url: false,
          body: `*${otp}* is your verification code for Fashion Friday. Please do not share this code with anyone.`,
        },
      };
    } else {
      // Official WhatsApp Template Message
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedRecipient,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: templateLang,
          },
          components,
        },
      };
    }

    try {
      this.logger.log(
        `[WhatsAppService] Dispatching OTP via WhatsApp to ${formattedRecipient} using template "${templateName}"...`,
      );

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (response.ok && responseData.messages) {
        const messages = responseData.messages as { id: string }[];
        const messageId = messages[0]?.id;
        this.logger.log(
          `[WhatsAppService] OTP successfully sent to ${formattedRecipient}. Message ID: ${messageId}`,
        );
        return { success: true, messageId };
      }

      this.logger.error(
        `[WhatsAppService] Failed to send WhatsApp message. HTTP ${response.status}. Response: ${JSON.stringify(
          responseData,
        )}`,
      );

      return {
        success: false,
        error:
          (responseData?.error as { message?: string })?.message ||
          `HTTP ${response.status}: Failed to send WhatsApp message`,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`[WhatsAppService] Network error sending WhatsApp message: ${errMsg}`, err);
      return { success: false, error: errMsg };
    }
  }

  /**
   * Handles incoming webhooks from Meta (status updates and messages).
   */
  handleIncomingWebhook(payload: Record<string, unknown>): void {
    try {
      const entry = (payload.entry as WhatsAppWebhookEntry[]) || [];
      for (const e of entry) {
        const changes = e.changes || [];
        for (const change of changes) {
          const value = change.value || {};

          // 1. Delivery & Read Statuses
          if (Array.isArray(value.statuses)) {
            for (const statusObj of value.statuses) {
              const statusId = typeof statusObj.id === 'string' ? statusObj.id : 'unknown';
              const status = typeof statusObj.status === 'string' ? statusObj.status : 'unknown';
              const recipient =
                typeof statusObj.recipient_id === 'string' ? statusObj.recipient_id : 'unknown';

              this.logger.log(
                `[WhatsAppService] Message status update: ID ${statusId} -> ${status} for recipient ${recipient}`,
              );
              if (statusObj.errors) {
                this.logger.warn(
                  `[WhatsAppService] Message error status: ${JSON.stringify(statusObj.errors)}`,
                );
              }
            }
          }

          // 2. Incoming Messages
          if (Array.isArray(value.messages)) {
            for (const msg of value.messages) {
              const from = typeof msg.from === 'string' ? msg.from : 'unknown';
              const type = typeof msg.type === 'string' ? msg.type : 'unknown';

              this.logger.log(
                `[WhatsAppService] Received incoming message from ${from}: type=${type}`,
              );
            }
          }
        }
      }
    } catch (err) {
      this.logger.error('[WhatsAppService] Error parsing incoming webhook payload:', err);
    }
  }
}
