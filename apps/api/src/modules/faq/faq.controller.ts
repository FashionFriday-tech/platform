import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller()
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // Public endpoint for storefront
  @Get('faq')
  async getFaqs() {
    return this.faqService.getAllFaqs();
  }

  // Admin endpoint: List all FAQs
  @Get('admin/faq')
  async getAllFaqs() {
    return this.faqService.getAllFaqs();
  }

  // Admin endpoint: Create a new FAQ
  @Post('admin/faq')
  async createFaq(
    @Body()
    body: {
      question: string;
      answer: string;
      category: string;
      href?: string;
      linkText?: string;
      sortOrder?: number;
    },
  ) {
    return this.faqService.createFaq(body);
  }

  // Admin endpoint: Update an FAQ
  @Put('admin/faq/:id')
  async updateFaq(
    @Param('id') id: string,
    @Body()
    body: {
      question?: string;
      answer?: string;
      category?: string;
      href?: string;
      linkText?: string;
      sortOrder?: number;
    },
  ) {
    return this.faqService.updateFaq(id, body);
  }

  // Admin endpoint: Delete an FAQ
  @Delete('admin/faq/:id')
  async deleteFaq(@Param('id') id: string) {
    return this.faqService.deleteFaq(id);
  }
}
