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
import { Msg91Service } from './msg91.service';

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
    private msg91Service: Msg91Service,
  ) {}

  // In-memory fallbacks for development when DB is down
  private otpMap = new Map<string, { otpHash: string; expiresAt: Date }>();
  private userMap = new Map<
    string,
    {
      id: string;
      phone: string;
      email: string;
      name: string;
      role: string;
      isPhoneVerified: boolean;
      accountStatus: string;
      createdAt: Date;
      refreshToken?: string | null;
      avatarUrl?: string | null;
      isEmailVerified?: boolean | null;
    }
  >();

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
    try {
      await this.prisma.db.otp.upsert({
        where: { phone },
        update: { otpHash, expiresAt },
        create: { phone, otpHash, expiresAt },
      });
    } catch (error) {
      this.logger.error(
        `Database error while saving OTP for ${phone}, using memory fallback:`,
        error,
      );
      // Fallback to memory for development
      this.otpMap.set(phone, { otpHash, expiresAt });
    }

    return { success: true, message: 'OTP sent successfully (Fallback enabled)' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, otp } = dto;

    // 1. Find OTP entry
    let otpEntry;
    try {
      otpEntry = await this.prisma.db.otp.findUnique({
        where: { phone },
      });
    } catch {
      this.logger.warn(
        `Database unreachable during OTP verification for ${phone}, checking memory fallback`,
      );
      otpEntry = this.otpMap.get(phone);
    }

    if (!otpEntry) {
      throw new BadRequestException('OTP not requested for this phone number');
    }

    if (new Date() > otpEntry.expiresAt) {
      this.otpMap.delete(phone);
      throw new BadRequestException('OTP has expired');
    }

    // 2. Verify Argon2 hash
    const isValid = await argon2.verify(otpEntry.otpHash, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // 3. Cleanup
    try {
      await this.prisma.db.otp.delete({ where: { phone } });
    } catch {
      this.otpMap.delete(phone);
    }

    // 4. Check if user exists
    let user;
    try {
      user = await this.prisma.db.user.findUnique({
        where: { phone },
      });
    } catch {
      this.logger.error(`Database error during user lookup for ${phone}. Proceeding as new user.`);
      user = null;
    }

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
    let existingUser;
    try {
      existingUser = await this.prisma.db.user.findFirst({
        where: {
          OR: [{ phone }, { email }],
        },
      });
    } catch {
      this.logger.warn(`Database unreachable during signup check, checking memory fallback`);
      existingUser = Array.from(this.userMap.values()).find(
        (u) => u.phone === phone || u.email === email,
      );
    }

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
    } catch (error) {
      this.logger.error(`Database error during user creation, using memory fallback:`, error);

      // Fallback: Create mock user in memory
      const mockUser = {
        id: `mock-${Date.now()}`,
        phone,
        email,
        name,
        role: 'CUSTOMER',
        isPhoneVerified: true,
        accountStatus: 'ACTIVE',
        createdAt: new Date(),
      };
      this.userMap.set(mockUser.id, mockUser);

      // 4. Generate Tokens
      const tokens = await this.getTokens(mockUser.id, mockUser.role);
      // Skip updateRefreshToken if DB is down, memory user doesn't need it for this session

      return {
        isNewUser: false,
        ...tokens,
        user: mockUser,
      };
    }
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      const hashedRefreshToken = await argon2.hash(refreshToken);
      await this.prisma.db.user.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken },
      });
    } catch {
      this.logger.warn(`Failed to update refresh token in DB for ${userId} (Database down)`);
    }
  }

  private async getTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '15m',
        ) as unknown as number,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '90d',
        ) as unknown as number,
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
    let user;
    try {
      user = await this.prisma.db.user.findUnique({
        where: { id: userId },
      });
    } catch {
      this.logger.warn(
        `Database unreachable during profile fetch for ${userId}, checking memory fallback`,
      );
      user = this.userMap.get(userId);
    }

    if (!user && userId.startsWith('mock-')) {
      user = this.userMap.get(userId);
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

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

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    try {
      const updatedUser = await this.prisma.db.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          email: data.email,
        },
      });

      const { refreshToken, ...userWithoutToken } = updatedUser;
      return userWithoutToken;
    } catch {
      throw new BadRequestException('Failed to update profile');
    }
  }

  async deleteAccount(userId: string) {
    try {
      await this.prisma.db.user.delete({
        where: { id: userId },
      });
      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete account for user ${userId}:`, error);
      throw new BadRequestException(
        'Failed to delete account due to existing dependencies or database error',
      );
    }
  }

  async sendEmailVerificationOtp(userId: string) {
    const user = await this.prisma.db.user.findUnique({ where: { id: userId } });
    if (!user?.email) {
      throw new BadRequestException('User or email not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.logger.log(`[SECURE EMAIL OTP MOCK] Sending OTP ${otp} to email ${user.email}`);

    const otpHash = await argon2.hash(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    try {
      await this.prisma.db.otp.upsert({
        where: { email: user.email },
        update: { otpHash, expiresAt },
        create: { email: user.email, otpHash, expiresAt },
      });
    } catch (error) {
      this.logger.error(`Failed to save email OTP for ${user.email}:`, error);
      throw new InternalServerErrorException('Failed to send email OTP');
    }

    return { success: true, message: 'Email OTP sent successfully' };
  }

  async verifyEmailOtp(userId: string, otp: string) {
    const user = await this.prisma.db.user.findUnique({ where: { id: userId } });
    if (!user?.email) {
      throw new BadRequestException('User or email not found');
    }

    const otpEntry = await this.prisma.db.otp.findUnique({
      where: { email: user.email },
    });

    if (!otpEntry) {
      throw new BadRequestException('OTP not requested for this email');
    }

    if (new Date() > otpEntry.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    const isValid = await argon2.verify(otpEntry.otpHash, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.prisma.db.otp.delete({ where: { email: user.email } });

    const updatedUser = await this.prisma.db.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });

    return { success: true, message: 'Email verified successfully', user: updatedUser };
  }

  async sendPhoneVerificationOtp(userId: string) {
    const user = await this.prisma.db.user.findUnique({ where: { id: userId } });
    if (!user?.phone) {
      throw new BadRequestException('User or phone number not found');
    }

    // Rate Limiting: Check if OTP was sent less than 60 seconds ago
    const existingOtp = await this.prisma.db.otp.findUnique({
      where: { phone: user.phone },
    });

    if (existingOtp) {
      const secondsSinceLastSend = (Date.now() - existingOtp.createdAt.getTime()) / 1000;
      if (secondsSinceLastSend < 60) {
        throw new BadRequestException(
          `Please wait ${Math.ceil(60 - secondsSinceLastSend)} seconds before requesting another OTP`,
        );
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Call Msg91Service to dispatch the WhatsApp/SMS OTP
    await this.msg91Service.sendOtp(user.phone, otp);

    const otpHash = await argon2.hash(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    try {
      await this.prisma.db.otp.upsert({
        where: { phone: user.phone },
        update: { otpHash, expiresAt, createdAt: new Date() },
        create: { phone: user.phone, otpHash, expiresAt },
      });
    } catch (error) {
      this.logger.error(`Failed to save phone OTP for ${user.phone}:`, error);
      throw new InternalServerErrorException('Failed to send WhatsApp OTP');
    }

    return { success: true, message: 'WhatsApp OTP sent successfully' };
  }

  async verifyPhoneOtp(userId: string, otp: string) {
    const user = await this.prisma.db.user.findUnique({ where: { id: userId } });
    if (!user?.phone) {
      throw new BadRequestException('User or phone number not found');
    }

    const otpEntry = await this.prisma.db.otp.findUnique({
      where: { phone: user.phone },
    });

    if (!otpEntry) {
      throw new BadRequestException('OTP not requested for this phone number');
    }

    if (new Date() > otpEntry.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    const isValid = await argon2.verify(otpEntry.otpHash, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.prisma.db.otp.delete({ where: { phone: user.phone } });

    const updatedUser = await this.prisma.db.user.update({
      where: { id: userId },
      data: { isPhoneVerified: true },
    });

    return { success: true, message: 'Phone verified successfully', user: updatedUser };
  }
}
