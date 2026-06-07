import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { CustomersService } from './customers.service';
import { CreateCustomerDto, CreateCustomerOrderDto } from './dto/customers.dto';

@Controller('admin/customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Get()
  async getAllCustomers() {
    return this.service.getAllCustomers();
  }

  @Post()
  async createCustomer(@Body() dto: CreateCustomerDto) {
    return this.service.createCustomer(dto.name, dto.phone);
  }

  @Get(':id')
  async getCustomerDetails(@Param('id') id: string) {
    return this.service.getCustomerDetails(id);
  }

  @Post(':id/orders')
  async createCustomerOrder(@Param('id') id: string, @Body() dto: CreateCustomerOrderDto) {
    return this.service.createCustomerOrder(id, dto);
  }

  @Patch(':id')
  async updateCustomer(@Param('id') id: string, @Body() dto: { name?: string; phone?: string }) {
    return this.service.updateCustomer(id, dto);
  }

  @Patch(':id/status')
  async toggleCustomerStatus(@Param('id') id: string) {
    return this.service.toggleCustomerStatus(id);
  }

  @Get(':id/cart')
  async getCustomerCart(@Param('id') id: string) {
    return this.service.getCustomerCart(id);
  }

  @Get(':id/wishlist')
  async getCustomerWishlist(@Param('id') id: string) {
    return this.service.getCustomerWishlist(id);
  }

  @Get(':id/addresses')
  async getCustomerAddresses(@Param('id') id: string) {
    return this.service.getCustomerAddresses(id);
  }

  @Post(':id/addresses')
  async createCustomerAddress(
    @Param('id') id: string,
    @Body() dto: any
  ) {
    return this.service.createCustomerAddress(id, dto);
  }

  @Patch(':id/cart/:itemId')
  async updateCustomerCartItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: { quantity: number }
  ) {
    return this.service.updateCustomerCartItem(id, itemId, dto.quantity);
  }

  @Post(':id/checkout-cart')
  async checkoutCustomerCart(@Param('id') id: string) {
    return this.service.checkoutCustomerCart(id);
  }
}
