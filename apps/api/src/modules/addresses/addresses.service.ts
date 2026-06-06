import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all addresses for an authenticated user
   */
  async getUserAddresses(userId: string) {
    return this.prisma.db.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Create a new address for a user
   */
  async createAddress(userId: string, dto: CreateAddressDto) {
    const existingCount = await this.prisma.db.address.count({
      where: { userId },
    });

    const isDefault = existingCount === 0 || dto.isDefault;

    return this.prisma.db.$transaction(async (tx) => {
      if (isDefault && existingCount > 0) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          label: dto.label ?? 'Home',
          isDefault,
          fullName: dto.fullName,
          phoneNumber: dto.phoneNumber,
          altPhoneNumber: dto.altPhoneNumber || null,
          building: dto.building || null,
          street: dto.street,
          city: dto.city,
          district: dto.district || 'Malappuram',
          state: dto.state || 'Kerala',
          pincode: dto.pincode,
          landmark: dto.landmark || null,
        },
      });
    });
  }

  /**
   * Update an existing address
   */
  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    const existing = await this.prisma.db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.db.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: addressId },
        data: {
          ...(dto.label !== undefined && { label: dto.label }),
          ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
          ...(dto.fullName !== undefined && { fullName: dto.fullName }),
          ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
          ...(dto.altPhoneNumber !== undefined && { altPhoneNumber: dto.altPhoneNumber || null }),
          ...(dto.building !== undefined && { building: dto.building || null }),
          ...(dto.street !== undefined && { street: dto.street }),
          ...(dto.city !== undefined && { city: dto.city }),
          ...(dto.district !== undefined && { district: dto.district }),
          ...(dto.state !== undefined && { state: dto.state }),
          ...(dto.pincode !== undefined && { pincode: dto.pincode }),
          ...(dto.landmark !== undefined && { landmark: dto.landmark || null }),
        },
      });
    });
  }

  /**
   * Delete an address
   */
  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.prisma.db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.db.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id: addressId },
      });

      if (existing.isDefault) {
        const remaining = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });

        if (remaining) {
          await tx.address.update({
            where: { id: remaining.id },
            data: { isDefault: true },
          });
        }
      }

      return { success: true };
    });
  }

  /**
   * Set an address as default
   */
  async setDefaultAddress(userId: string, addressId: string) {
    const existing = await this.prisma.db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.db.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });
  }
}
