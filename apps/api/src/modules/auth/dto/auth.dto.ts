import { SendOtpSchema, SignupSchema, VerifyOtpSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class SendOtpDto extends createZodDto(SendOtpSchema) {
  phone!: string;
}

export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {
  phone!: string;
  otp!: string;
}

export class SignupDto extends createZodDto(SignupSchema) {
  phone!: string;
  email!: string;
  name!: string;
  otpToken!: string;
}
