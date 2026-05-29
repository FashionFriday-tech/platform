import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductRequestsService } from './product-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@ff/database';
import type { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    id?: string;
    sub?: string;
  };
}

@Controller('product-requests')
export class ProductRequestsController {
  constructor(private readonly service: ProductRequestsService) {}

  // Admin endpoint: List all product sourcing requests
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF_ADMIN)
  async getAllRequests() {
    return this.service.getAllRequests();
  }

  // Public endpoint (Requires User Login): File Sourcing Request
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createRequest(
    @Req() req: AuthRequest,
    @Body('productName') productName?: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id || req.user.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }
    if (!productName || productName.trim().length < 3) {
      throw new BadRequestException('Product name must be at least 3 characters.');
    }
    if (!file) {
      throw new BadRequestException('Product image file is required.');
    }

    return this.service.createRequest(userId, productName, file);
  }
}
