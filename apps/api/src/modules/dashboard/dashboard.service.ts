import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

interface CachedEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  private statsCache: CachedEntry<any> | null = null;
  private activityCache: CachedEntry<any> | null = null;
  private readonly CACHE_TTL_MS = 15000; // 15 seconds cache for high performance & cost efficiency

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const now = Date.now();
    if (this.statsCache && this.statsCache.expiresAt > now) {
      return this.statsCache.data;
    }

    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

      const [
        totalOrdersCount,
        pendingOrdersCount,
        shippedOrdersCount,
        deliveredOrdersCount,
        allRevenueAgg,
        todayOrdersCount,
        todayRevenueAgg,
        recentWeekRevenueAgg,
        previousWeekRevenueAgg,
        totalProductsCount,
        lowStockProductsCount,
        totalCustomersCount,
        newCustomersTodayCount,
        totalSellersCount,
        totalReviewsCount,
      ] = await Promise.all([
        // Total orders
        this.prisma.db.order.count(),

        // Pending / need fulfillment orders
        this.prisma.db.order.count({
          where: {
            status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] },
          },
        }),

        // Shipped orders
        this.prisma.db.order.count({
          where: { status: 'SHIPPED' },
        }),

        // Delivered orders
        this.prisma.db.order.count({
          where: { status: 'DELIVERED' },
        }),

        // Total sales revenue
        this.prisma.db.order.aggregate({
          where: {
            status: { notIn: ['CANCELLED', 'RETURNED', 'REFUNDED'] },
          },
          _sum: { finalAmount: true },
        }),

        // Orders placed today
        this.prisma.db.order.count({
          where: { createdAt: { gte: todayStart } },
        }),

        // Revenue today
        this.prisma.db.order.aggregate({
          where: {
            createdAt: { gte: todayStart },
            status: { notIn: ['CANCELLED', 'RETURNED', 'REFUNDED'] },
          },
          _sum: { finalAmount: true },
        }),

        // Revenue in last 7 days
        this.prisma.db.order.aggregate({
          where: {
            createdAt: { gte: sevenDaysAgo },
            status: { notIn: ['CANCELLED', 'RETURNED', 'REFUNDED'] },
          },
          _sum: { finalAmount: true },
        }),

        // Revenue in prior 7-day window (7 to 14 days ago)
        this.prisma.db.order.aggregate({
          where: {
            createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
            status: { notIn: ['CANCELLED', 'RETURNED', 'REFUNDED'] },
          },
          _sum: { finalAmount: true },
        }),

        // Total products
        this.prisma.db.product.count(),

        // Low stock products (total stock <= 5 units)
        this.prisma.db.product.count({
          where: { totalStock: { lte: 5 } },
        }),

        // Total customers
        this.prisma.db.user.count({
          where: { role: 'CUSTOMER' },
        }),

        // New customers registered today
        this.prisma.db.user.count({
          where: {
            role: 'CUSTOMER',
            createdAt: { gte: todayStart },
          },
        }),

        // Total sellers
        this.prisma.db.seller.count().catch(() => 0),

        // Total customer reviews
        this.prisma.db.review.count().catch(() => 0),
      ]);

      const totalSales = Number(allRevenueAgg._sum.finalAmount || 0);
      const todaySales = Number(todayRevenueAgg._sum.finalAmount || 0);
      const recentWeekSales = Number(recentWeekRevenueAgg._sum.finalAmount || 0);
      const prevWeekSales = Number(previousWeekRevenueAgg._sum.finalAmount || 0);

      let salesGrowthPercentage = 0;
      if (prevWeekSales > 0) {
        salesGrowthPercentage = Math.round(
          ((recentWeekSales - prevWeekSales) / prevWeekSales) * 100,
        );
      } else if (recentWeekSales > 0) {
        salesGrowthPercentage = 100;
      }

      const result = {
        totalSales,
        todaySales,
        salesGrowthPercentage,
        totalOrders: totalOrdersCount,
        todayOrders: todayOrdersCount,
        pendingOrders: pendingOrdersCount,
        shippedOrders: shippedOrdersCount,
        deliveredOrders: deliveredOrdersCount,
        totalProducts: totalProductsCount,
        lowStockCount: lowStockProductsCount,
        totalCustomers: totalCustomersCount,
        newCustomersToday: newCustomersTodayCount,
        totalSellers: totalSellersCount,
        totalReviews: totalReviewsCount,
        lastUpdated: new Date().toISOString(),
      };

      this.statsCache = {
        data: result,
        expiresAt: now + this.CACHE_TTL_MS,
      };

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to calculate dashboard statistics: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getDashboardActivity(limit = 10) {
    const now = Date.now();
    if (this.activityCache && this.activityCache.expiresAt > now) {
      return this.activityCache.data;
    }

    try {
      const [recentOrders, recentProducts, recentCustomers] = await Promise.all([
        // 1. Recent orders
        this.prisma.db.order.findMany({
          take: 6,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            finalAmount: true,
            status: true,
            createdAt: true,
            user: { select: { name: true } },
          },
        }),

        // 2. Recent products added or updated
        this.prisma.db.product.findMany({
          take: 4,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            sellingPrice: true,
            totalStock: true,
            createdAt: true,
          },
        }),

        // 3. Recent registered users
        this.prisma.db.user.findMany({
          take: 4,
          where: { role: 'CUSTOMER' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        }),
      ]);

      const activities: {
        id: string;
        type: 'order' | 'product' | 'customer';
        title: string;
        description: string;
        timestamp: string;
        timeAgo: string;
        user: { name: string; avatar: string };
        status?: string;
        amount?: number;
      }[] = [];

      // Format Orders
      for (const order of recentOrders) {
        const customerName = order.user?.name || 'Customer';
        const formattedAmount = Number(order.finalAmount).toLocaleString('en-IN');
        const statusText =
          order.status === 'DELIVERED'
            ? 'delivered'
            : order.status === 'SHIPPED'
              ? 'shipped'
              : order.status === 'PROCESSING'
                ? 'in fulfillment'
                : 'placed';

        activities.push({
          id: `act-order-${order.id}`,
          type: 'order',
          title: `Order #${order.orderNumber} ${statusText} (₹${formattedAmount})`,
          description: `Customer ${customerName} • Status: ${order.status}`,
          timestamp: order.createdAt.toISOString(),
          timeAgo: this.formatTimeAgo(order.createdAt),
          user: {
            name: customerName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=10b981&color=fff`,
          },
          status: order.status,
          amount: Number(order.finalAmount),
        });
      }

      // Format Products
      for (const product of recentProducts) {
        const price = Number(product.sellingPrice).toLocaleString('en-IN');
        activities.push({
          id: `act-prod-${product.id}`,
          type: 'product',
          title: `Catalog item added: "${product.name}"`,
          description: `Price: ₹${price} • Current Stock: ${product.totalStock} units`,
          timestamp: product.createdAt.toISOString(),
          timeAgo: this.formatTimeAgo(product.createdAt),
          user: {
            name: 'Catalog Manager',
            avatar: 'https://ui-avatars.com/api/?name=Catalog+Manager&background=3b82f6&color=fff',
          },
        });
      }

      // Format Customers
      for (const customer of recentCustomers) {
        activities.push({
          id: `act-cust-${customer.id}`,
          type: 'customer',
          title: `New customer registered: ${customer.name}`,
          description: 'Account verified & active',
          timestamp: customer.createdAt.toISOString(),
          timeAgo: this.formatTimeAgo(customer.createdAt),
          user: {
            name: customer.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=8b5cf6&color=fff`,
          },
        });
      }

      // Sort all activities chronologically descending
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const finalActivities = activities.slice(0, limit);

      this.activityCache = {
        data: finalActivities,
        expiresAt: now + this.CACHE_TTL_MS,
      };

      return finalActivities;
    } catch (error: any) {
      this.logger.error(`Failed to fetch dashboard activity feed: ${error.message}`, error.stack);
      return [];
    }
  }

  private formatTimeAgo(date: Date): string {
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
    if (elapsedSeconds < 60) {
      return `${elapsedSeconds}s ago`;
    }
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    if (elapsedMinutes < 60) {
      return `${elapsedMinutes}m ago`;
    }
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) {
      return `${elapsedHours}h ago`;
    }
    const elapsedDays = Math.floor(elapsedHours / 24);
    if (elapsedDays < 30) {
      return `${elapsedDays}d ago`;
    }
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }
}
