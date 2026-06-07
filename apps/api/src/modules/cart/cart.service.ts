import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';

const MAX_QUANTITY_PER_ITEM = 10;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch all cart items for an authenticated user with product details
   */
  async getUserCart(userId: string) {
    const items = await this.prisma.db.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            brand: true,
            ogPrice: true,
            sellingPrice: true,
            mainImage: true,
            totalStock: true,
            sizes: true,
            colors: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: item.product
        ? {
            ...item.product,
            ogPrice: Number(item.product.ogPrice),
            sellingPrice: Number(item.product.sellingPrice),
          }
        : null,
    }));
  }

  /**
   * Add an item to user's cart (or increment quantity if identical variant exists)
   */
  async addToCart(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.db.product.findUnique({
      where: { id: dto.productId },
      select: { id: true, totalStock: true, status: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Relaxed stock validation for demo/dev mode
    // if (product.totalStock <= 0) {
    //   throw new BadRequestException('Product is currently out of stock');
    // }

    const size = dto.size || 'Standard';
    const color = dto.color || 'Standard';
    const addQuantity = Math.max(1, dto.quantity || 1);

    const existing = await this.prisma.db.cartItem.findUnique({
      where: {
        userId_productId_size_color: {
          userId,
          productId: dto.productId,
          size,
          color,
        },
      },
    });

    if (existing) {
      const maxAllowed = Math.min(Math.max(product.totalStock, 10), MAX_QUANTITY_PER_ITEM);
      const newQuantity = Math.min(existing.quantity + addQuantity, maxAllowed);

      await this.prisma.db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
      });
    } else {
      const initialQuantity = Math.min(addQuantity, Math.max(product.totalStock, 10), MAX_QUANTITY_PER_ITEM);
      await this.prisma.db.cartItem.create({
        data: {
          userId,
          productId: dto.productId,
          size,
          color,
          quantity: initialQuantity,
        },
      });
    }

    return this.getUserCart(userId);
  }

  /**
   * Update quantity of a specific cart item
   */
  async updateQuantity(userId: string, itemId: string, dto: UpdateCartQuantityDto) {
    const existing = await this.prisma.db.cartItem.findFirst({
      where: { id: itemId, userId },
      include: { product: { select: { totalStock: true } } },
    });

    if (!existing) {
      throw new NotFoundException('Cart item not found');
    }

    if (dto.quantity <= 0) {
      await this.prisma.db.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      const maxAllowed = Math.min(Math.max(existing.product?.totalStock ?? 10, 10), MAX_QUANTITY_PER_ITEM);
      const newQuantity = Math.min(dto.quantity, maxAllowed);

      await this.prisma.db.cartItem.update({
        where: { id: itemId },
        data: { quantity: newQuantity },
      });
    }

    return this.getUserCart(userId);
  }

  /**
   * Remove a single item from cart
   */
  async removeItem(userId: string, itemId: string) {
    const existing = await this.prisma.db.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (existing) {
      await this.prisma.db.cartItem.delete({
        where: { id: itemId },
      });
    }

    return this.getUserCart(userId);
  }

  /**
   * Clear entire cart for a user
   */
  async clearCart(userId: string) {
    await this.prisma.db.cartItem.deleteMany({
      where: { userId },
    });

    return [];
  }

  /**
   * Smart Sync: Merge guest cart items into user's DB cart without duplicates
   */
  async syncGuestCart(userId: string, dto: SyncCartDto) {
    if (!dto.items || dto.items.length === 0) {
      return this.getUserCart(userId);
    }

    // Get all valid products from DB
    const productIds = dto.items.map((i) => i.productId);
    const validProducts = await this.prisma.db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, totalStock: true },
    });

    const productMap = new Map(validProducts.map((p) => [p.id, p]));

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        continue;
      }

      const size = item.size || 'Standard';
      const color = item.color || 'Standard';
      const maxAllowed = Math.min(Math.max(product.totalStock, 10), MAX_QUANTITY_PER_ITEM);

      const existing = await this.prisma.db.cartItem.findUnique({
        where: {
          userId_productId_size_color: {
            userId,
            productId: item.productId,
            size,
            color,
          },
        },
      });

      if (existing) {
        // Merge quantities safely
        const mergedQuantity = Math.min(existing.quantity + item.quantity, maxAllowed);
        await this.prisma.db.cartItem.update({
          where: { id: existing.id },
          data: { quantity: mergedQuantity },
        });
      } else {
        const initialQuantity = Math.min(item.quantity, maxAllowed);
        await this.prisma.db.cartItem.create({
          data: {
            userId,
            productId: item.productId,
            size,
            color,
            quantity: initialQuantity,
          },
        });
      }
    }

    return this.getUserCart(userId);
  }
}
