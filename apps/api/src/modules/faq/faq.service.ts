import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { triggerRevalidation } from '../revalidate-helper';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFaqs() {
    return this.prisma.db.faq.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createFaq(data: {
    question: string;
    answer: string;
    category: string;
    href?: string;
    linkText?: string;
    sortOrder?: number;
  }) {
    let order = data.sortOrder;
    if (order === undefined) {
      const last = await this.prisma.db.faq.findFirst({
        orderBy: { sortOrder: 'desc' },
      });
      order = (last?.sortOrder ?? -1) + 1;
    }

    const result = await this.prisma.db.faq.create({
      data: {
        ...data,
        sortOrder: order,
      },
    });

    this.triggerFaqRevalidation();
    return result;
  }

  async updateFaq(
    id: string,
    data: {
      question?: string;
      answer?: string;
      category?: string;
      href?: string;
      linkText?: string;
      sortOrder?: number;
    },
  ) {
    const existing = await this.prisma.db.faq.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('FAQ not found');

    const result = await this.prisma.db.faq.update({
      where: { id },
      data,
    });

    this.triggerFaqRevalidation();
    return result;
  }

  async deleteFaq(id: string) {
    const existing = await this.prisma.db.faq.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('FAQ not found');

    const result = await this.prisma.db.faq.delete({
      where: { id },
    });

    this.triggerFaqRevalidation();
    return result;
  }

  private triggerFaqRevalidation() {
    triggerRevalidation('help-faq');
    triggerRevalidation('help-faq', '/help/faq');
  }
}
