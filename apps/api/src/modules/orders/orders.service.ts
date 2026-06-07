import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, PaymentStatus } from '@ff/database';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    this.logger.log(`[OrdersService] ---------------- ORDER CREATION STARTED ----------------`);
    this.logger.log(`[OrdersService] Processing order for userId: ${userId}, paymentMethod: ${dto.paymentMethod}`);

    // 1. Fetch user's cart
    this.logger.log(`[OrdersService] Step 1: Fetching cart items from DB for user: ${userId}`);
    let cartItems = await this.prisma.db.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    this.logger.log(`[OrdersService] Found ${cartItems.length} items in user's DB cart`);

    if (cartItems.length === 0) {
      this.logger.warn(`[OrdersService] User ${userId} cart is empty in database`);
      throw new BadRequestException('Your cart is empty. Please add items to cart before placing an order.');
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
      this.logger.warn(`[OrdersService] No address found for user ${userId}, applying fallback address for checkout`);
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
      this.logger.log(`[OrdersService] Using address for ${defaultAddress.fullName}, ${defaultAddress.city}`);
    }

    // 4. Create order
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.logger.log(`[OrdersService] Step 4: Creating Order record ${orderNumber} in database...`);

    try {
      const order = await this.prisma.db.order.create({
        data: {
          userId,
          orderNumber,
          status: OrderStatus.CONFIRMED,
          paymentStatus: dto.paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.SUCCESS,
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

      this.logger.log(`[OrdersService] Step 5: Order created successfully with ${order.items.length} items. ID: ${order.id}`);

      // 5. Clear cart
      this.logger.log(`[OrdersService] Step 6: Clearing cart items in DB for user ${userId}...`);
      await this.prisma.db.cartItem.deleteMany({
        where: { userId },
      });

      this.logger.log(`[OrdersService] ---------------- ORDER CREATION COMPLETE ----------------`);
      return order;
    } catch (dbError: any) {
      this.logger.error(`[OrdersService] Database error creating order: ${dbError.message}`, dbError.stack);
      throw new BadRequestException(`Failed to process order in database: ${dbError.message}`);
    }
  }

  async findAll() {
    return this.prisma.db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { name: true, phone: true } },
      },
    });
  }

  async findUserOrders(userId: string) {
    return this.prisma.db.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.db.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: { select: { name: true, phone: true } },
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    this.logger.log(`[OrdersService] Updating order ${id} with: ${JSON.stringify(dto)}`);
    const existing = await this.prisma.db.order.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.db.order.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.trackingNumber !== undefined ? { trackingNumber: dto.trackingNumber } : {}),
        ...(dto.courierPartner !== undefined ? { courierPartner: dto.courierPartner } : {}),
      },
      include: {
        items: true,
        user: { select: { name: true, phone: true } },
      },
    });

    this.logger.log(
      `[OrdersService] Order ${id} updated. New status: ${updated.status}, tracking: ${updated.trackingNumber}`,
    );
    return updated;
  }

  async remove(id: string) {
    return this.prisma.db.order.delete({
      where: { id },
    });
  }
}
