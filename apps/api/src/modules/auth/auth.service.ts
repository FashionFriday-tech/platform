import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { PrismaService } from '../../database/prisma.service';
import { SendOtpDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';

interface JwtPayload {
  sub: string;
  role?: string;
  phone?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phone } = dto;

    // 1. Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In production, send OTP via SMS integration (e.g., Twilio)
    this.logger.log(`[SECURE SMS MOCK] Sending OTP ${otp} to phone ${phone}`);

    // 2. Hash it securely using Argon2
    const otpHash = await argon2.hash(otp);

    // 3. Set expiry to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 4. Save to OTP table
    await this.prisma.db.otp.upsert({
      where: { phone },
      update: { otpHash, expiresAt },
      create: { phone, otpHash, expiresAt },
    });

    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, otp } = dto;

    // 1. Find OTP entry
    const otpEntry = await this.prisma.db.otp.findUnique({
      where: { phone },
    });

    if (!otpEntry) {
      throw new BadRequestException('OTP not requested for this phone number');
    }

    if (new Date() > otpEntry.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    // 2. Verify Argon2 hash
    const isValid = await argon2.verify(otpEntry.otpHash, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // 3. Delete OTP entry once validated (prevent replay attacks)
    await this.prisma.db.otp.delete({ where: { phone } });

    // 4. Check if user exists
    const user = await this.prisma.db.user.findUnique({
      where: { phone },
    });

    if (user) {
      // User exists -> Generate JWT tokens
      const tokens = await this.getTokens(user.id, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return { isNewUser: false, ...tokens, user };
    } else {
      // User does NOT exist -> Generate temporary token for sign up
      const tempToken = this.jwtService.sign({ phone }, { expiresIn: '15m' });
      return {
        isNewUser: true,
        message: 'Please complete registration',
        otpToken: tempToken,
      };
    }
  }

  async signup(dto: SignupDto) {
    const { phone, email, name, otpToken } = dto;

    // 1. Verify otpToken
    try {
      const decoded = this.jwtService.verify<JwtPayload>(otpToken);
      if (decoded.phone !== phone) {
        throw new BadRequestException('Phone number mapping mismatch');
      }
    } catch {
      throw new UnauthorizedException('Invalid or expired signup token. Please verify OTP again.');
    }

    // 2. Check if user already exists
    const existingUser = await this.prisma.db.user.findFirst({
      where: {
        OR: [{ phone }, { email }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this phone or email already exists');
    }

    // 3. Create user
    try {
      const newUser = await this.prisma.db.user.create({
        data: {
          phone,
          email,
          name,
          role: 'CUSTOMER',
          isPhoneVerified: true,
          accountStatus: 'ACTIVE',
        },
      });

      // 4. Generate Tokens
      const tokens = await this.getTokens(newUser.id, newUser.role);
      await this.updateRefreshToken(newUser.id, tokens.refreshToken);

      return {
        isNewUser: false,
        ...tokens,
        user: newUser,
      };
    } catch {
      throw new InternalServerErrorException('Error creating user account');
    }
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prisma.db.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  private async getTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '90d') as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.prisma.db.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { success: true, message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...userWithoutToken } = user;
    return userWithoutToken;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id: userId },
    });

    if (user?.accountStatus !== 'ACTIVE' || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateProfile(userId: string, data: any) {
    try {
      const updatedUser = await this.prisma.db.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          email: data.email,
          avatarUrl: data.avatarUrl,
          // Add other fields if needed, currentlyprisma model might not have them
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { refreshToken, ...userWithoutToken } = updatedUser;
      return userWithoutToken;
    } catch {
      throw new BadRequestException('Failed to update profile');
    }
  }
}
