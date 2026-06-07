import { AccountStatus, OrderStatus, PaymentMethod, PaymentStatus, UserRole } from '@ff/database';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCustomers() {
    const users = await this.prisma.db.user.findMany({
      where: { role: UserRole.CUSTOMER },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          select: {
            createdAt: true,
            finalAmount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => {
      const orders = user.orders || [];
      const totalSpent = orders.reduce((sum, order) => sum + Number(order.finalAmount), 0);
      const lastOrderDate =
        orders.length > 0 ? orders[0].createdAt.toISOString() : user.createdAt.toISOString();

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        status: user.accountStatus === 'ACTIVE' ? 'active' : 'blocked',
        ordersCount: orders.length,
        totalSpent,
        joinDate: user.createdAt.toISOString(),
        lastOrderDate,
        wishlistCount: 0,
        cartCount: 0,
        addressCount: 0,
      };
    });
  }

  async getCustomerDetails(id: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: true,
          },
        },
        _count: {
          select: {
            wishlistItems: true,
            cartItems: true,
            addresses: true,
          },
        },
      },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const orders = user.orders || [];
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.finalAmount), 0);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=000000&textColor=ffffff`,
      status: user.accountStatus === 'ACTIVE' ? 'active' : 'blocked',
      ordersCount: orders.length,
      totalSpent,
      wishlistCount: user._count.wishlistItems,
      cartCount: user._count.cartItems,
      addressCount: user._count.addresses,
      joinDate: user.createdAt.toISOString(),
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.finalAmount),
        status: order.status.toLowerCase(),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
      })),
    };
  }

  async createCustomer(name: string, phone: string) {
    const phoneDigits = phone.replace(/[^0-9]/g, '');
    const email = `nan-${phoneDigits}`;

    // Check if user already exists
    const existing = await this.prisma.db.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existing) {
      throw new BadRequestException('A customer with this phone number already exists.');
    }

    const shortId = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newUser = await this.prisma.db.user.create({
      data: {
        id: shortId,
        name,
        email,
        phone,
        role: UserRole.CUSTOMER,
        accountStatus: 'ACTIVE',
        isPhoneVerified: true,
      },
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newUser.name)}`,
      status: 'active',
      ordersCount: 0,
      totalSpent: 0,
      wishlistCount: 0,
      cartCount: 0,
      addressCount: 0,
      joinDate: newUser.createdAt.toISOString(),
      lastOrderDate: newUser.createdAt.toISOString(),
    };
  }

  async createCustomerOrder(
    customerId: string,
    details: {
      productName: string;
      size: string;
      color: string;
      price: number;
      quantity: number;
      paymentMethod: 'COD' | 'RAZORPAY' | 'STRIPE' | 'WALLET';
      paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
      addressLine: string;
      city: string;
      state: string;
      pinCode: string;
    },
  ) {
    const user = await this.prisma.db.user.findUnique({
      where: { id: customerId },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const orderNumber = `FF-${Math.floor(100000 + Math.random() * 900000)}`;
    const lineTotal = details.price * details.quantity;

    const shippingAddress = {
      addressLine: details.addressLine,
      city: details.city,
      state: details.state,
      pinCode: details.pinCode,
    };

    // Use prisma transaction to make sure Order and OrderItem are created together
    return this.prisma.db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: customerId,
          orderNumber,
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus[details.paymentStatus],
          paymentMethod: PaymentMethod[details.paymentMethod],
          totalAmount: lineTotal,
          finalAmount: lineTotal,
          shippingAddress,
          items: {
            create: {
              productId: `prod-manual-${Date.now()}`,
              name: details.productName,
              image:
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80',
              size: details.size,
              color: details.color,
              price: details.price,
              quantity: details.quantity,
            },
          },
        },
        include: {
          items: true,
        },
      });

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.finalAmount),
        status: order.status.toLowerCase(),
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
      };
    });
  }

  async toggleCustomerStatus(id: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Customer not found');
    }

    const nextStatus =
      user.accountStatus === AccountStatus.ACTIVE ? AccountStatus.BANNED : AccountStatus.ACTIVE;

    const updated = await this.prisma.db.user.update({
      where: { id },
      data: { accountStatus: nextStatus },
    });

    return {
      id: updated.id,
      status: updated.accountStatus === 'ACTIVE' ? 'active' : 'blocked',
    };
  }

  async updateCustomer(id: string, data: { name?: string; phone?: string }) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name;
    }
    if (data.phone) {
      updateData.phone = data.phone;
      if (user.email.startsWith('nan-')) {
        const phoneDigits = data.phone.replace(/[^0-9]/g, '');
        updateData.email = `nan-${phoneDigits}`;
      }
    }

    const updated = await this.prisma.db.user.update({
      where: { id },
      data: updateData,
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(updated.name)}`,
      status: updated.accountStatus === 'ACTIVE' ? 'active' : 'blocked',
    };
  }

  async getCustomerCart(id: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const items = await this.prisma.db.cartItem.findMany({
      where: { userId: id },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product?.name || 'Unknown Product',
      image: item.product?.mainImage || '',
      price: Number(item.product?.sellingPrice || 0),
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      addedAt: item.createdAt.toISOString(),
    }));
  }

  async getCustomerWishlist(id: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const items = await this.prisma.db.wishlistItem.findMany({
      where: { userId: id },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product?.name || 'Unknown Product',
      image: item.product?.mainImage || '',
      price: Number(item.product?.sellingPrice || 0),
      addedAt: item.createdAt.toISOString(),
    }));
  }
  async getCustomerAddresses(id: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const addresses = await this.prisma.db.address.findMany({
      where: { userId: id },
      orderBy: { isDefault: 'desc' },
    });

    return addresses;
  }

  async createCustomerAddress(id: string, dto: any) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const newAddress = await this.prisma.db.address.create({
      data: {
        userId: id,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        altPhoneNumber: dto.altPhoneNumber || null,
        label: dto.label || 'Home',
        building: dto.building || null,
        street: dto.street,
        city: dto.city,
        district: dto.district,
        state: dto.state,
        pincode: dto.pincode,
        landmark: dto.landmark || null,
        isDefault: dto.isDefault || false,
      },
    });

    // If this is set to default, unset others
    if (newAddress.isDefault) {
      await this.prisma.db.address.updateMany({
        where: { userId: id, id: { not: newAddress.id } },
        data: { isDefault: false },
      });
    }

    return newAddress;
  }

  async updateCustomerCartItem(id: string, itemId: string, quantity: number) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const cartItem = await this.prisma.db.cartItem.findFirst({
      where: { id: itemId, userId: id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.prisma.db.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      await this.prisma.db.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.getCustomerCart(id);
  }

  async checkoutCustomerCart(id: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id },
    });

    if (user?.role !== UserRole.CUSTOMER) {
      throw new NotFoundException('Customer not found');
    }

    const items = await this.prisma.db.cartItem.findMany({
      where: { userId: id },
      include: { product: true },
    });

    if (items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderNumber = `FF-${Math.floor(100000 + Math.random() * 900000)}`;
    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const price = Number(item.product?.sellingPrice || 0);
      totalAmount += price * item.quantity;
      return {
        productId: item.productId,
        name: item.product?.name || 'Unknown Product',
        image: item.product?.mainImage || '',
        size: item.size,
        color: item.color,
        price,
        quantity: item.quantity,
      };
    });

    const defaultAddress = await this.prisma.db.address.findFirst({
      where: { userId: id, isDefault: true },
    });

    const shippingAddress = defaultAddress
      ? {
          addressLine: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          pinCode: defaultAddress.pincode,
        }
      : {
          addressLine: 'Admin Checkout',
          city: 'N/A',
          state: 'N/A',
          pinCode: '000000',
        };

    return this.prisma.db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: id,
          orderNumber,
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.COD,
          totalAmount,
          finalAmount: totalAmount,
          shippingAddress,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({
        where: { userId: id },
      });

      return order;
    });
  }
}
