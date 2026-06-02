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
}
