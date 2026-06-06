import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch all wishlisted products for a user with optimized fields
   */
  async getUserWishlist(userId: string) {
    const items = await this.prisma.db.wishlistItem.findMany({
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
      createdAt: item.createdAt,
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
   * Toggle product in user's wishlist (Add if absent, Remove if present)
   */
  async toggleWishlist(userId: string, productId: string) {
    // 1. Verify product exists
    const product = await this.prisma.db.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 2. Check if already wishlisted
    const existing = await this.prisma.db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await this.prisma.db.wishlistItem.delete({
        where: { id: existing.id },
      });

      return {
        isWishlisted: false,
        productId,
        message: 'Product removed from wishlist',
      };
    }

    await this.prisma.db.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    return {
      isWishlisted: true,
      productId,
      message: 'Product added to wishlist',
    };
  }

  /**
   * Remove a single product from user's wishlist
   */
  async removeFromWishlist(userId: string, productId: string) {
    const existing = await this.prisma.db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await this.prisma.db.wishlistItem.delete({
        where: { id: existing.id },
      });
    }

    return {
      isWishlisted: false,
      productId,
      message: 'Product removed from wishlist',
    };
  }

  /**
   * Smart Merge guest items into user account upon login
   */
  async syncGuestWishlist(userId: string, productIds: string[]) {
    if (!productIds || productIds.length === 0) {
      return this.getUserWishlist(userId);
    }

    // Find valid existing products only
    const validProducts = await this.prisma.db.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: { id: true },
    });

    if (validProducts.length > 0) {
      await this.prisma.db.wishlistItem.createMany({
        data: validProducts.map((p) => ({
          userId,
          productId: p.id,
        })),
        skipDuplicates: true, // Prevents duplicate entries natively in PostgreSQL
      });
    }

    return this.getUserWishlist(userId);
  }

  /**
   * Check if a specific product is in user's wishlist (O(1) B-tree lookup)
   */
  async checkIsWishlisted(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: { id: true },
    });

    return !!item;
  }
}
