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
   * Fetch all cart items for an authenticated user with product details.
   * Consolidates any duplicate variants with identical product and size into a single card.
   */
  async getUserCart(userId: string) {
    const rawItems = await this.prisma.db.cartItem.findMany({
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
      orderBy: { createdAt: 'asc' },
    });

    const consolidatedMap = new Map<string, (typeof rawItems)[0]>();
    const duplicateIdsToDelete: string[] = [];

    for (const item of rawItems) {
      const normalizedSize = (item.size || 'Standard').trim().toLowerCase();
      const key = `${item.productId}_${normalizedSize}`;
      const existing = consolidatedMap.get(key);

      if (existing) {
        const maxStock = existing.product?.totalStock ?? 10;
        const newQty = Math.min(existing.quantity + item.quantity, maxStock, MAX_QUANTITY_PER_ITEM);
        existing.quantity = newQty;
        if (item.color && item.color.toLowerCase() !== 'standard') {
          existing.color = item.color;
        }
        duplicateIdsToDelete.push(item.id);
      } else {
        consolidatedMap.set(key, { ...item });
      }
    }

    if (duplicateIdsToDelete.length > 0) {
      try {
        await this.prisma.db.cartItem.deleteMany({
          where: { id: { in: duplicateIdsToDelete } },
        });
        for (const item of consolidatedMap.values()) {
          await this.prisma.db.cartItem.update({
            where: { id: item.id },
            data: { quantity: item.quantity, color: item.color },
          });
        }
      } catch (err) {
        console.warn('Failed to cleanup duplicate cart items in DB:', err);
      }
    }

    const items = Array.from(consolidatedMap.values());

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
   * Add an item to user's cart (or increment quantity if identical product & size exists)
   */
  async addToCart(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.db.product.findFirst({
      where: { OR: [{ id: dto.productId }, { slug: dto.productId }] },
      select: { id: true, totalStock: true, status: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productId = product.id;
    const size = dto.size || 'Standard';
    const color = dto.color || 'Standard';
    const addQuantity = Math.max(1, dto.quantity || 1);

    const existing = await this.prisma.db.cartItem.findFirst({
      where: {
        userId,
        productId,
        size: { equals: size, mode: 'insensitive' },
      },
    });

    if (existing) {
      const maxAllowed = Math.min(Math.max(product.totalStock, 10), MAX_QUANTITY_PER_ITEM);
      const newQuantity = Math.min(existing.quantity + addQuantity, maxAllowed);
      const preferredColor = color && color.toLowerCase() !== 'standard' ? color : existing.color;

      await this.prisma.db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity, color: preferredColor },
      });
    } else {
      const initialQuantity = Math.min(
        addQuantity,
        Math.max(product.totalStock, 10),
        MAX_QUANTITY_PER_ITEM,
      );
      await this.prisma.db.cartItem.create({
        data: {
          userId,
          productId,
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
      const maxAllowed = Math.min(
        Math.max(existing.product?.totalStock ?? 10, 10),
        MAX_QUANTITY_PER_ITEM,
      );
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

    // Get all valid products from DB (matching by ID or slug)
    const productKeys = dto.items.map((i) => i.productId);
    const validProducts = await this.prisma.db.product.findMany({
      where: {
        OR: [{ id: { in: productKeys } }, { slug: { in: productKeys } }],
      },
      select: { id: true, slug: true, totalStock: true },
    });

    const productMap = new Map<string, (typeof validProducts)[0]>();
    for (const p of validProducts) {
      productMap.set(p.id, p);
      if (p.slug) {
        productMap.set(p.slug, p);
      }
    }

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        continue;
      }

      const size = item.size || 'Standard';
      const color = item.color || 'Standard';
      const maxAllowed = Math.min(Math.max(product.totalStock, 10), MAX_QUANTITY_PER_ITEM);

      const existing = await this.prisma.db.cartItem.findFirst({
        where: {
          userId,
          productId: product.id,
          size: { equals: size, mode: 'insensitive' },
        },
      });

      if (existing) {
        // Merge quantities safely without duplicate doubling
        const mergedQuantity = Math.min(Math.max(existing.quantity, item.quantity), maxAllowed);
        const preferredColor = color && color.toLowerCase() !== 'standard' ? color : existing.color;
        await this.prisma.db.cartItem.update({
          where: { id: existing.id },
          data: { quantity: mergedQuantity, color: preferredColor },
        });
      } else {
        const initialQuantity = Math.min(item.quantity, maxAllowed);
        await this.prisma.db.cartItem.create({
          data: {
            userId,
            productId: product.id,
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
