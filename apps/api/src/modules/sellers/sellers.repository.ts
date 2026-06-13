import { Prisma, SellerStatus, generateBrandId } from '@ff/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateSellerDto, SellerQueryDto, UpdateSellerDto } from './dto';

@Injectable()
export class SellersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: SellerQueryDto) {
    const where: Prisma.SellerWhereInput = {};

    if (query?.search) {
      const s = query.search.trim();
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { storeName: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ];
    }

    if (query?.categoryId) {
      where.categories = {
        some: { id: query.categoryId },
      };
    }

    if (query?.status) {
      where.status = query.status;
    }

    return this.prisma.db.seller.findMany({
      where,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            gender: true,
          },
        },
        products: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            products: true,
            orderItems: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.db.seller.findUnique({
      where: { id },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            gender: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            mainImage: true,
            sellingPrice: true,
            totalStock: true,
            status: true,
          },
          take: 12,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            products: true,
            orderItems: true,
          },
        },
      },
    });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.db.seller.findMany({
      where: {
        status: SellerStatus.ACTIVE,
        categories: {
          some: { id: categoryId },
        },
      },
      select: {
        id: true,
        name: true,
        storeName: true,
        phone: true,
      },
      orderBy: { storeName: 'asc' },
    });
  }

  async getSellerOrders(sellerId: string) {
    // Find all orders that contain items belonging to this seller
    const orders = await this.prisma.db.order.findMany({
      where: {
        items: {
          some: { sellerId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        items: {
          where: { sellerId },
          select: {
            id: true,
            productId: true,
            name: true,
            image: true,
            size: true,
            color: true,
            price: true,
            quantity: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => {
      const sellerSubtotal = order.items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );
      const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        totalAmount: Number(order.totalAmount),
        sellerSubtotal,
        totalItemsCount,
        customer: order.user,
        shippingAddress: order.shippingAddress,
        items: order.items.map((it) => ({
          ...it,
          price: Number(it.price),
          subtotal: Number(it.price) * it.quantity,
        })),
        createdAt: order.createdAt,
      };
    });
  }

  async getSellerProducts(sellerId: string) {
    return this.prisma.db.product.findMany({
      where: { sellerId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [totalSellers, activeSellers, totalProducts, totalOrderItems] = await Promise.all([
      this.prisma.db.seller.count(),
      this.prisma.db.seller.count({ where: { status: SellerStatus.ACTIVE } }),
      this.prisma.db.product.count({ where: { sellerId: { not: null } } }),
      this.prisma.db.orderItem.count({ where: { sellerId: { not: null } } }),
    ]);

    return {
      totalSellers,
      activeSellers,
      totalProducts,
      totalOrderItems,
    };
  }

  async create(dto: CreateSellerDto) {
    const { categoryIds, ...data } = dto;
    return this.prisma.db.seller.create({
      data: {
        id: generateBrandId('DLR'),
        name: data.name,
        storeName: data.storeName,
        email: data.email || null,
        phone: data.phone,
        address: data.address || null,
        website: data.website || null,
        instagram: data.instagram || null,
        status: data.status ?? SellerStatus.ACTIVE,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            gender: true,
          },
        },
        _count: {
          select: {
            products: true,
            orderItems: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateSellerDto) {
    const { categoryIds, ...data } = dto;
    const updateData: Prisma.SellerUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.storeName !== undefined && { storeName: data.storeName }),
      ...(data.email !== undefined && { email: data.email || null }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address || null }),
      ...(data.website !== undefined && { website: data.website || null }),
      ...(data.instagram !== undefined && { instagram: data.instagram || null }),
      ...(data.status !== undefined && { status: data.status }),
    };

    if (categoryIds) {
      updateData.categories = {
        set: categoryIds.map((catId) => ({ id: catId })),
      };
    }

    return this.prisma.db.seller.update({
      where: { id },
      data: updateData,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            gender: true,
          },
        },
        _count: {
          select: {
            products: true,
            orderItems: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.db.seller.delete({
      where: { id },
    });
  }
}
