import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateSellerDto, SellerQueryDto, UpdateSellerDto } from './dto';
import { SellersRepository } from './sellers.repository';

@Injectable()
export class SellersService {
  private readonly logger = new Logger(SellersService.name);

  constructor(private readonly repository: SellersRepository) {}

  async findAll(query?: SellerQueryDto) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    const seller = await this.repository.findById(id);
    if (!seller) {
      throw new NotFoundException(`Seller with ID "${id}" not found`);
    }
    return seller;
  }

  async findByCategory(categoryId: string) {
    return this.repository.findByCategory(categoryId);
  }

  async getSellerOrders(sellerId: string) {
    // Verify seller exists
    await this.findById(sellerId);
    return this.repository.getSellerOrders(sellerId);
  }

  async getSellerProducts(sellerId: string) {
    // Verify seller exists
    await this.findById(sellerId);
    return this.repository.getSellerProducts(sellerId);
  }

  async getStats() {
    return this.repository.getStats();
  }

  async create(dto: CreateSellerDto) {
    this.logger.log(`Registering new seller: ${dto.storeName} (${dto.name})`);
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateSellerDto) {
    await this.findById(id);
    this.logger.log(`Updating seller ${id}`);
    return this.repository.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);
    this.logger.log(`Deleting seller ${id}`);
    return this.repository.delete(id);
  }
}
