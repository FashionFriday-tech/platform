import {
  Body,
  Controller,
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
    const id = req.user?.id || req.user?.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    return this.authService.logout(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: AuthRequest) {
    const id = req.user?.id || req.user?.sub;
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
    const sub = req.user?.sub;
    const refreshToken = req.user?.refreshToken;
    if (!sub || !refreshToken) {
      throw new UnauthorizedException();
    }
    return this.authService.refreshTokens(sub, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Req() req: AuthRequest, @Body() body: any) {
    const id = req.user?.id || req.user?.sub;
    if (!id) {
      throw new UnauthorizedException();
    }
    return this.authService.updateProfile(id, body);
  }
}
