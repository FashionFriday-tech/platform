import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class Msg91Service {
  private readonly logger = new Logger(Msg91Service.name);
  private readonly authKey = process.env.MSG91_AUTH_KEY;
  private readonly templateId = process.env.MSG91_OTP_TEMPLATE_ID;

  async sendOtp(phone: string, otp: string): Promise<boolean> {
    if (!this.authKey || !this.templateId) {
      this.logger.warn(
        'MSG91_AUTH_KEY or MSG91_OTP_TEMPLATE_ID is missing from environment. Skipping API send.',
      );
      return false;
    }

    // Format phone to international format without leading '+' (e.g. +919876543210 -> 919876543210)
    const formattedPhone = phone.replace('+', '');

    try {
      const response = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: this.authKey,
        },
        body: JSON.stringify({
          template_id: this.templateId,
          mobile: formattedPhone,
          otp: otp,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok && responseData.type === 'success') {
        this.logger.log(`OTP successfully dispatched via MSG91 to phone number: ${phone}`);
        return true;
      }

      this.logger.error(
        `Failed to send MSG91 OTP. Status: ${response.status}. Error Response: ${JSON.stringify(responseData)}`,
      );
      return false;
    } catch (error) {
      this.logger.error('Error occurred while contacting MSG91 API gateway:', error);
      throw new InternalServerErrorException(
        'Failed to dispatch verification code via WhatsApp/SMS',
      );
    }
  }
}
