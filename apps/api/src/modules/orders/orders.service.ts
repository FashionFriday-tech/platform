import { OrderStatus, PaymentStatus, generateBrandId } from '@ff/database';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    this.logger.log(`[OrdersService] ---------------- ORDER CREATION STARTED ----------------`);
    this.logger.log(
      `[OrdersService] Processing order for userId: ${userId}, paymentMethod: ${dto.paymentMethod}`,
    );

    // 1. Fetch user's cart
    this.logger.log(`[OrdersService] Step 1: Fetching cart items from DB for user: ${userId}`);
    const cartItems = await this.prisma.db.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    this.logger.log(`[OrdersService] Found ${cartItems.length} items in user's DB cart`);

    if (cartItems.length === 0) {
      this.logger.warn(`[OrdersService] User ${userId} cart is empty in database`);
      throw new BadRequestException(
        'Your cart is empty. Please add items to cart before placing an order.',
      );
    }

    // 2. Calculate totals
    this.logger.log(`[OrdersService] Step 2: Calculating totals and preparing order line items`);
    let totalAmount = 0;
    const itemsData = cartItems.map((item) => {
      const price = Number(item.product?.sellingPrice ?? 0);
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        name: item.product?.name || 'Fashion Product',
        image: item.product?.mainImage || '',
        size: item.size || 'Standard',
        color: item.color || 'Standard',
        price: price,
        quantity: item.quantity,
        sellerId: item.product?.sellerId || null,
      };
    });

    const discountAmount = 0;
    const shippingFees = dto.paymentMethod === 'COD' ? 200 : 0;
    const finalAmount = totalAmount - discountAmount + shippingFees;

    this.logger.log(
      `[OrdersService] Totals calculated: subtotal=₹${totalAmount}, shipping=₹${shippingFees}, discount=₹${discountAmount}, finalAmount=₹${finalAmount}`,
    );

    // 3. Fetch default address or most recent address
    this.logger.log(`[OrdersService] Step 3: Fetching delivery address for user: ${userId}`);
    let defaultAddress = await this.prisma.db.address.findFirst({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    if (!defaultAddress) {
      this.logger.warn(
        `[OrdersService] No address found for user ${userId}, applying fallback address for checkout`,
      );
      defaultAddress = {
        id: 'fallback-address',
        userId,
        fullName: 'Customer',
        phoneNumber: '9999999999',
        street: 'Main Street',
        city: 'Malappuram',
        district: 'Malappuram',
        state: 'Kerala',
        pincode: '676505',
        isDefault: true,
        label: 'Home',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    } else {
      this.logger.log(
        `[OrdersService] Using address for ${defaultAddress.fullName}, ${defaultAddress.city}`,
      );
    }

    // 4. Create order
    const orderNumber = generateBrandId('ORD');
    this.logger.log(`[OrdersService] Step 4: Creating Order record ${orderNumber} in database...`);

    try {
      const order = await this.prisma.db.order.create({
        data: {
          id: orderNumber,
          userId,
          orderNumber,
          status: OrderStatus.PENDING,
          paymentStatus:
            dto.paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.SUCCESS,
          paymentMethod: dto.paymentMethod,
          totalAmount,
          discountAmount,
          shippingFees,
          finalAmount,
          shippingAddress: JSON.parse(JSON.stringify(defaultAddress)),
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });

      this.logger.log(
        `[OrdersService] Step 5: Order created successfully with ${order.items.length} items. ID: ${order.id}`,
      );

      // 5. Clear cart
      this.logger.log(`[OrdersService] Step 6: Clearing cart items in DB for user ${userId}...`);
      await this.prisma.db.cartItem.deleteMany({
        where: { userId },
      });

      this.logger.log(`[OrdersService] ---------------- ORDER CREATION COMPLETE ----------------`);
      return order;
    } catch (dbError: any) {
      this.logger.error(
        `[OrdersService] Database error creating order: ${dbError.message}`,
        dbError.stack,
      );
      throw new BadRequestException(`Failed to process order in database: ${dbError.message}`);
    }
  }

  async getOrderStats() {
    const [totalOrders, unplacedOnSellersCount, processingCount, shippedCount, deliveredCount] =
      await Promise.all([
        this.prisma.db.order.count(),
        this.prisma.db.order.count({
          where: {
            status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
          },
        }),
        this.prisma.db.order.count({
          where: {
            status: OrderStatus.PROCESSING,
          },
        }),
        this.prisma.db.order.count({
          where: {
            status: OrderStatus.SHIPPED,
          },
        }),
        this.prisma.db.order.count({
          where: {
            status: OrderStatus.DELIVERED,
          },
        }),
      ]);

    return {
      totalOrders,
      unplacedCount: unplacedOnSellersCount,
      nonPlacedOnSellers: unplacedOnSellersCount,
      processingCount,
      shippedCount,
      deliveredCount,
    };
  }

  async findAll() {
    const orders = await this.prisma.db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { name: true, phone: true } },
      },
    });

    const allProductIds = orders
      .flatMap((o) => o.items.map((i) => i.productId))
      .filter((id) => id && !id.startsWith('prod-manual'));
    const allItemNames = orders
      .flatMap((o) => o.items)
      .map((i) => i.name)
      .filter(Boolean);

    const products =
      allProductIds.length > 0 || allItemNames.length > 0
        ? await this.prisma.db.product.findMany({
            where: {
              OR: [
                ...(allProductIds.length > 0 ? [{ id: { in: allProductIds } }] : []),
                ...(allItemNames.length > 0 ? [{ name: { in: allItemNames } }] : []),
              ],
            },
            select: {
              id: true,
              name: true,
              mainImage: true,
              promoImage: true,
              liveImages: true,
            },
          })
        : [];

    const productById = new Map(products.map((p) => [p.id, p]));
    const productByName = new Map(products.map((p) => [p.name.toLowerCase(), p]));

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const prod = productById.get(item.productId) || productByName.get(item.name.toLowerCase());
        const prodImg = prod?.mainImage || prod?.promoImage || prod?.liveImages?.[0] || '';
        const resolvedImage =
          item.image && !item.image.includes('photo-1523381210434-271e8be1f52b')
            ? item.image
            : prodImg || '';
        return {
          ...item,
          image: resolvedImage,
        };
      }),
    }));
  }

  async findUserOrders(userId: string) {
    return this.prisma.db.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async findOne(id: string) {
    const includeConfig = {
      items: {
        include: {
          seller: true,
        },
      },
      user: { select: { name: true, phone: true } },
    };

    const order =
      (await this.prisma.db.order.findUnique({
        where: { id },
        include: includeConfig,
      })) ||
      (await this.prisma.db.order.findUnique({
        where: { orderNumber: id },
        include: includeConfig,
      }));

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const productIds = order.items
      .map((i) => i.productId)
      .filter((id) => id && !id.startsWith('prod-manual'));
    const itemNames = order.items.map((i) => i.name).filter(Boolean);

    const products =
      productIds.length > 0 || itemNames.length > 0
        ? await this.prisma.db.product.findMany({
            where: {
              OR: [
                ...(productIds.length > 0 ? [{ id: { in: productIds } }] : []),
                ...(itemNames.length > 0 ? [{ name: { in: itemNames } }] : []),
              ],
            },
            select: {
              id: true,
              name: true,
              mainImage: true,
              promoImage: true,
              liveImages: true,
              sellerId: true,
              categoryId: true,
              category: { select: { id: true, name: true, slug: true } },
              seller: { select: { id: true, name: true, storeName: true } },
            },
          })
        : [];

    const productMap = new Map(products.map((p) => [p.id, p]));
    const productByNameMap = new Map(products.map((p) => [p.name.toLowerCase(), p]));

    const enrichedItems = order.items.map((item) => {
      const prod = productMap.get(item.productId) || productByNameMap.get(item.name.toLowerCase());
      const prodImg = prod?.mainImage || prod?.promoImage || prod?.liveImages?.[0] || '';
      const resolvedImage =
        item.image && !item.image.includes('photo-1523381210434-271e8be1f52b')
          ? item.image
          : prodImg || '';

      return {
        ...item,
        image: resolvedImage,
        productSellerId: prod?.sellerId ?? item.sellerId ?? null,
        categoryId: prod?.categoryId ?? null,
        categoryName: prod?.category?.name ?? null,
        product: prod ? { ...prod, image: resolvedImage } : null,
      };
    });

    return {
      ...order,
      items: enrichedItems,
    };
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    this.logger.log(`[OrdersService] Updating order ${id} with: ${JSON.stringify(dto)}`);
    const existing =
      (await this.prisma.db.order.findUnique({ where: { id } })) ||
      (await this.prisma.db.order.findUnique({ where: { orderNumber: id } }));

    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    if ((dto as any).sellerId !== undefined) {
      const targetSellerId = (dto as any).sellerId || null;
      await this.prisma.db.orderItem.updateMany({
        where: { orderId: existing.id },
        data: { sellerId: targetSellerId },
      });
    }

    const updated = await this.prisma.db.order.update({
      where: { id: existing.id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.trackingNumber !== undefined ? { trackingNumber: dto.trackingNumber } : {}),
        ...(dto.courierPartner !== undefined ? { courierPartner: dto.courierPartner } : {}),
      },
      include: {
        items: {
          include: {
            seller: true,
          },
        },
        user: { select: { name: true, phone: true } },
      },
    });

    this.logger.log(
      `[OrdersService] Order ${existing.id} updated. New status: ${updated.status}, tracking: ${updated.trackingNumber ?? 'none'}`,
    );
    return updated;
  }

  async remove(id: string) {
    const existing =
      (await this.prisma.db.order.findUnique({ where: { id } })) ||
      (await this.prisma.db.order.findUnique({ where: { orderNumber: id } }));

    if (!existing) {
      throw new NotFoundException('Order not found');
    }
    return this.prisma.db.order.delete({
      where: { id: existing.id },
    });
  }
}
