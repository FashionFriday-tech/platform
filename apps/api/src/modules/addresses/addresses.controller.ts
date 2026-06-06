import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

interface AuthRequest extends Request {
  user: {
    id?: string;
    sub?: string;
  };
}

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  private getUserId(req: AuthRequest): string {
    const id = req.user?.id || req.user?.sub;
    if (!id) {
      throw new UnauthorizedException('Authentication required');
    }
    return id;
  }

  /**
   * GET /addresses
   * List all saved addresses for current user
   */
  @Get()
  async getAddresses(@Req() req: AuthRequest) {
    const userId = this.getUserId(req);
    return this.addressesService.getUserAddresses(userId);
  }

  /**
   * POST /addresses
   * Create a new address
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAddress(@Req() req: AuthRequest, @Body() dto: CreateAddressDto) {
    const userId = this.getUserId(req);
    return this.addressesService.createAddress(userId, dto);
  }

  /**
   * PUT /addresses/:id
   * Update an address
   */
  @Put(':id')
  async updateAddress(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    const userId = this.getUserId(req);
    return this.addressesService.updateAddress(userId, id, dto);
  }

  /**
   * PATCH /addresses/:id
   * Partially update an address
   */
  @Patch(':id')
  async patchAddress(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    const userId = this.getUserId(req);
    return this.addressesService.updateAddress(userId, id, dto);
  }

  /**
   * PATCH /addresses/:id/default
   * Mark an address as default
   */
  @Patch(':id/default')
  @HttpCode(HttpStatus.OK)
  async setDefaultAddress(@Req() req: AuthRequest, @Param('id') id: string) {
    const userId = this.getUserId(req);
    return this.addressesService.setDefaultAddress(userId, id);
  }

  /**
   * DELETE /addresses/:id
   * Remove an address
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAddress(@Req() req: AuthRequest, @Param('id') id: string) {
    const userId = this.getUserId(req);
    return this.addressesService.deleteAddress(userId, id);
  }
}
