import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

import { AuthService } from './auth.service';
import { SendOtpDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RefreshTokenGuard } from './guards/refresh.guard';

interface AuthRequest extends Request {
  user: {
    id?: string;
    sub?: string;
    refreshToken?: string;
  };
}

@Controller('auth')
@UsePipes(ZodValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: AuthRequest) {
    const id = req.user.id || req.user.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    return this.authService.logout(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: AuthRequest) {
    const id = req.user.id || req.user.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    return this.authService.getProfile(id);
  }

  @UseGuards(RefreshTokenGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: AuthRequest) {
    const sub = req.user.sub;
    const refreshToken = req.user.refreshToken;
    if (!sub || !refreshToken) {
      throw new UnauthorizedException();
    }
    return this.authService.refreshTokens(sub, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Req() req: AuthRequest, @Body() body: { name?: string; email?: string }) {
    const id = req.user.id || req.user.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    return this.authService.updateProfile(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Req() req: AuthRequest) {
    const id = req.user.id || req.user.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    return this.authService.deleteAccount(id);
  }

  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('email/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendEmailOtp(@Req() req: AuthRequest) {
    const id = req.user.id || req.user.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    return this.authService.sendEmailVerificationOtp(id);
  }

  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('email/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyEmailOtp(@Req() req: AuthRequest, @Body() body: { otp: string }) {
    const id = req.user.id || req.user.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    if (!body.otp) {
      throw new BadRequestException('OTP is required');
    }
    return this.authService.verifyEmailOtp(id, body.otp);
  }

  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('phone/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendPhoneOtp(@Req() req: AuthRequest) {
    const id = req.user.id || req.user.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    return this.authService.sendPhoneVerificationOtp(id);
  }

  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('phone/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyPhoneOtp(@Req() req: AuthRequest, @Body() body: { otp: string }) {
    const id = req.user.id || req.user.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    if (!body.otp) {
      throw new BadRequestException('OTP is required');
    }
    return this.authService.verifyPhoneOtp(id, body.otp);
  }
}
