import { Gender, generateBrandId, Prisma, ProductStatus } from '@ff/database';
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../../database/prisma.service';
import { triggerRevalidation } from '../../revalidate-helper';
import { UploadService } from '../../upload/upload.service';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { ProductsRepository } from '../products.repository';

@Injectable()
export class AdminProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const rawDto = dto as any;
    const allSellerIds: string[] =
      Array.isArray(rawDto.sellerIds) && rawDto.sellerIds.length > 0
        ? rawDto.sellerIds.filter(Boolean)
        : rawDto.sellerId
          ? [rawDto.sellerId]
          : [];
    const primarySellerId = allSellerIds[0] || rawDto.sellerId || undefined;

    const name = (dto.name || '').trim().toUpperCase();
    let slug = (dto.slug || '').trim().toLowerCase();
    if (!slug) {
      slug =
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') || `prod-${Date.now()}`;
    }

    // Auto-deduplicate slug if already exists in database
    const existingWithSlug = await this.productsRepository.findBySlug(slug);
    if (existingWithSlug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const description = (dto.description || '').trim().toUpperCase();
    const rawBrand = dto.brand as unknown;
    const brand = Array.isArray(rawBrand)
      ? rawBrand.map((b) => (typeof b === 'string' ? b.trim().toUpperCase() : '')).filter(Boolean)
      : typeof rawBrand === 'string' && rawBrand.trim()
        ? [rawBrand.trim().toUpperCase()]
        : ['FASHION FRIDAY'];
    const sizes = Array.isArray(dto.attributes?.sizes)
      ? dto.attributes.sizes.map((s) => s.trim().toUpperCase()).filter(Boolean)
      : [];
    const quality = (dto.attributes?.quality || 'STANDARD').toUpperCase();
    const collections = Array.isArray(dto.marketing?.collections)
      ? dto.marketing.collections.map((c) => c.trim().toUpperCase()).filter(Boolean)
      : [];
    const seoTitle = dto.marketing?.seoTitle ? dto.marketing.seoTitle.trim().toUpperCase() : null;
    const seoDescription = dto.marketing?.seoDescription
      ? dto.marketing.seoDescription.trim().toUpperCase()
      : null;

    // Verify category exists
    let validCategoryId: string | undefined;
    const requestedCatId = (dto as any).categoryId;
    if (requestedCatId) {
      const cat = await this.prisma.db.category.findUnique({
        where: { id: requestedCatId },
      });
      if (cat) {
        validCategoryId = cat.id;
      }
    }
    if (!validCategoryId) {
      const fallbackCat = await this.prisma.db.category.findFirst();
      validCategoryId = fallbackCat?.id;
    }

    // Verify seller exists
    let validSellerId: string | undefined;
    if (primarySellerId && primarySellerId !== 'none') {
      const seller = await this.prisma.db.seller.findUnique({
        where: { id: primarySellerId },
      });
      if (seller) {
        validSellerId = seller.id;
      }
    }

    const mainImage =
      dto.media?.mainImage ||
      'https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/placeholder.webp';

    const data: Prisma.ProductCreateInput = {
      id: generateBrandId('PROD'),
      name,
      slug,
      description,
      brand,
      status: dto.status.toUpperCase() as ProductStatus,
      ...(validCategoryId ? { category: { connect: { id: validCategoryId } } } : {}),
      sellerIds: allSellerIds,
      ...(validSellerId ? { seller: { connect: { id: validSellerId } } } : {}),
      gender: dto.gender.toUpperCase() as Gender,

      // Pricing
      ogPrice: dto.price.ogPrice ?? dto.price.sellingPrice ?? 0,
      sellingPrice: dto.price.sellingPrice,
      gettingPrice: dto.price.gettingPrice ?? 0,

      // Media
      mainImage,
      promoImage: dto.media.promoImage || null,
      liveImages: dto.media.liveImages ?? [],
      youtubeId: dto.media.youtubeId || null,

      // Attributes
      colors: dto.attributes.colors ?? [],
      quality,
      sizes,

      // Inventory
      totalStock: Math.min(100, Math.max(0, Number(dto.inventory?.totalStock) || 0)),

      // Social Proof & Real-time Metrics (never negative)
      liveWatching: Math.max(
        0,
        dto.liveMatrix?.liveWatching ?? (rawDto.liveWatching ? Number(rawDto.liveWatching) : 0),
      ),
      liveSold: Math.max(
        0,
        dto.liveMatrix?.liveSold ?? (rawDto.liveSold ? Number(rawDto.liveSold) : 0),
      ),
      averageRating:
        dto.rating?.averageRating !== undefined && dto.rating?.averageRating !== null
          ? Math.min(5, Math.max(0, dto.rating.averageRating))
          : rawDto.averageRating !== undefined
            ? Math.min(5, Math.max(0, Number(rawDto.averageRating)))
            : 4.0,
      totalReviews: Math.max(
        0,
        dto.rating?.totalReviews ?? (rawDto.totalReviews ? Number(rawDto.totalReviews) : 0),
      ),

      // Marketing
      collections,
      isFeatured: dto.marketing?.isFeatured ?? false,
      seoTitle,
      seoDescription,
    };

    try {
      const result = await this.productsRepository.create(data);
      this.triggerProductAndCategoryRevalidation(result);
      return result;
    } catch (error) {
      console.error('Failed to create product in database:', error);
      // NOTE: We do NOT delete uploaded images here!
      // Preserving uploaded images in storage prevents 404s when the user retries saving the form.
      throw error;
    }
  }

  private paginate([total, data]: [number, any[]], skip: number, take: number) {
    return {
      data,
      meta: {
        total,
        skip,
        take,
        page: Math.floor(skip / take) + 1,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getProducts(skip = 0, take = 10, search?: string, categoryId?: string) {
    const trimmed = search?.trim();
    const where: Prisma.ProductWhereInput = {
      ...(trimmed
        ? {
            OR: [
              { id: { contains: trimmed, mode: 'insensitive' } },
              { name: { contains: trimmed, mode: 'insensitive' } },
              { slug: { contains: trimmed, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(categoryId ? { categoryId } : {}),
    };
    const result = await this.productsRepository.findAll({ skip, take, where });
    return this.paginate(result, skip, take);
  }

  async getProductById(idOrSlug: string) {
    const isUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        idOrSlug,
      );
    if (isUuid) {
      return this.productsRepository.findById(idOrSlug);
    }
    return this.productsRepository.findBySlug(idOrSlug);
  }

  async getProductPerformance(id: string) {
    const product = await this.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productId = product.id;
    const now = new Date();

    // Fetch actual order items for this product
    const orderItems = await this.prisma.db.orderItem.findMany({
      where: {
        productId,
        order: {
          status: { notIn: ['CANCELLED', 'RETURNED', 'REFUNDED'] },
        },
      },
      select: {
        quantity: true,
        price: true,
        createdAt: true,
        order: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    // Fetch relevant search queries/impressions for this product
    const nameWords = (product.name || '').split(' ').filter((w) => w.length > 2);
    const searchLogs = await this.prisma.db.searchLog.findMany({
      where: {
        OR: [
          { query: { contains: product.name, mode: 'insensitive' } },
          ...(nameWords.length > 0
            ? nameWords.slice(0, 3).map((w) => ({
                query: { contains: w, mode: 'insensitive' as const },
              }))
            : []),
        ],
      },
      select: {
        createdAt: true,
      },
      take: 200,
    });

    const liveSold = Math.max(0, product.liveSold ?? 0);
    const liveWatching = Math.max(0, product.liveWatching ?? 0);
    const actualOrderSales = orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalKnownSales = Math.max(actualOrderSales, liveSold);

    // 1. DAILY (Last 7 Days)
    const dailyPoints: { label: string; sales: number; views: number; date: string }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      // Real order item sales on this date
      const dayOrders = orderItems.filter((item) => {
        const itemDate = item.order?.createdAt
          ? new Date(item.order.createdAt)
          : new Date(item.createdAt);
        return itemDate >= startOfDay && itemDate <= endOfDay;
      });
      const dayActualSales = dayOrders.reduce((sum, item) => sum + (item.quantity || 1), 0);

      // Real searches / views on this date
      const daySearches = searchLogs.filter((log) => {
        const logDate = new Date(log.createdAt);
        return logDate >= startOfDay && logDate <= endOfDay;
      }).length;

      // Dynamic baseline if liveSold > actual order sales
      const dayOffsetMultiplier = [0.8, 1.1, 0.9, 1.3, 1.2, 1.5, 1.4][(d.getDay() + 6) % 7];
      const syntheticSales =
        actualOrderSales === 0 && totalKnownSales > 0
          ? Math.max(0, Math.round((totalKnownSales / 14) * dayOffsetMultiplier))
          : 0;

      const sales = dayActualSales + syntheticSales;
      const baseDailyViews = Math.max(
        sales * 4,
        Math.round((liveWatching * 1.5 + 8) * dayOffsetMultiplier + daySearches * 2),
      );

      dailyPoints.push({
        label: dayNames[d.getDay()],
        sales,
        views: baseDailyViews,
        date: startOfDay.toISOString().split('T')[0],
      });
    }

    // 2. WEEKLY (Last 7 Weeks)
    const weeklyPoints: { label: string; sales: number; views: number; date: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

      const weekOrders = orderItems.filter((item) => {
        const itemDate = item.order?.createdAt
          ? new Date(item.order.createdAt)
          : new Date(item.createdAt);
        return itemDate >= weekStart && itemDate < weekEnd;
      });
      const weekActualSales = weekOrders.reduce((sum, item) => sum + (item.quantity || 1), 0);

      const weekSearches = searchLogs.filter((log) => {
        const logDate = new Date(log.createdAt);
        return logDate >= weekStart && logDate < weekEnd;
      }).length;

      const weekMultiplier = [0.7, 0.9, 1.2, 1.0, 1.4, 1.6, 1.5][6 - i];
      const syntheticSales =
        actualOrderSales === 0 && totalKnownSales > 0
          ? Math.max(0, Math.round((totalKnownSales / 5) * weekMultiplier))
          : 0;

      const sales = weekActualSales + syntheticSales;
      const views = Math.max(
        sales * 5,
        Math.round((liveWatching * 6 + 25) * weekMultiplier + weekSearches * 3),
      );

      weeklyPoints.push({
        label: `W${7 - i}`,
        sales,
        views,
        date: weekStart.toISOString().split('T')[0],
      });
    }

    // 3. MONTHLY (Last 7 Months)
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthlyPoints: { label: string; sales: number; views: number; date: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const mDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthOrders = orderItems.filter((item) => {
        const itemDate = item.order?.createdAt
          ? new Date(item.order.createdAt)
          : new Date(item.createdAt);
        return itemDate >= mDate && itemDate < nextMDate;
      });
      const monthActualSales = monthOrders.reduce((sum, item) => sum + (item.quantity || 1), 0);

      const monthSearches = searchLogs.filter((log) => {
        const logDate = new Date(log.createdAt);
        return logDate >= mDate && logDate < nextMDate;
      }).length;

      const monthMultiplier = [0.6, 0.8, 1.1, 1.3, 1.5, 1.8, 1.7][6 - i];
      const syntheticSales =
        actualOrderSales === 0 && totalKnownSales > 0
          ? Math.max(0, Math.round((totalKnownSales / 3) * monthMultiplier))
          : 0;

      const sales = monthActualSales + syntheticSales;
      const views = Math.max(
        sales * 6,
        Math.round((liveWatching * 20 + 60) * monthMultiplier + monthSearches * 5),
      );

      monthlyPoints.push({
        label: monthNames[mDate.getMonth()],
        sales,
        views,
        date: `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, '0')}`,
      });
    }

    // 4. YEARLY (Years active, e.g. 2024, 2025, 2026)
    const yearlyPoints: { label: string; sales: number; views: number; date: string }[] = [];
    const currentYear = now.getFullYear();
    const startYear = Math.max(2023, currentYear - 3);
    for (let y = startYear; y <= currentYear; y++) {
      const yStart = new Date(y, 0, 1);
      const yEnd = new Date(y + 1, 0, 1);

      const yearOrders = orderItems.filter((item) => {
        const itemDate = item.order?.createdAt
          ? new Date(item.order.createdAt)
          : new Date(item.createdAt);
        return itemDate >= yStart && itemDate < yEnd;
      });
      const yearActualSales = yearOrders.reduce((sum, item) => sum + (item.quantity || 1), 0);

      const yearSearches = searchLogs.filter((log) => {
        const logDate = new Date(log.createdAt);
        return logDate >= yStart && logDate < yEnd;
      }).length;

      const yearMultiplier = y === currentYear ? 1.0 : y === currentYear - 1 ? 0.8 : 0.4;
      const syntheticSales =
        actualOrderSales === 0 && totalKnownSales > 0
          ? Math.max(0, Math.round(totalKnownSales * yearMultiplier))
          : 0;

      const sales = yearActualSales + syntheticSales;
      const views = Math.max(
        sales * 7,
        Math.round((liveWatching * 100 + 200) * yearMultiplier + yearSearches * 10),
      );

      yearlyPoints.push({
        label: String(y),
        sales,
        views,
        date: String(y),
      });
    }

    const calcTimeframeMeta = (
      pts: { label: string; sales: number; views: number; date: string }[],
    ) => {
      const totalSales = pts.reduce((acc, curr) => acc + curr.sales, 0);
      const totalViews = pts.reduce((acc, curr) => acc + curr.views, 0);
      const avgSales = pts.length > 0 ? Math.round(totalSales / pts.length) : 0;
      return {
        totalSales,
        totalViews,
        avgSales,
        points: pts,
      };
    };

    return {
      productId: product.id,
      productName: product.name,
      daily: calcTimeframeMeta(dailyPoints),
      weekly: calcTimeframeMeta(weeklyPoints),
      monthly: calcTimeframeMeta(monthlyPoints),
      yearly: calcTimeframeMeta(yearlyPoints),
    };
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const data: Prisma.ProductUpdateInput = {};
    const d = dto as any;

    if (d.name) {
      data.name = typeof d.name === 'string' ? d.name.trim().toUpperCase() : undefined;
    }
    if (d.slug) {
      data.slug = typeof d.slug === 'string' ? d.slug.trim().toLowerCase() : undefined;
    }
    if (d.description) {
      data.description =
        typeof d.description === 'string' ? d.description.trim().toUpperCase() : undefined;
    }
    if (d.brand) {
      data.brand = Array.isArray(d.brand)
        ? d.brand.map((b: string) => b.trim().toUpperCase()).filter(Boolean)
        : typeof d.brand === 'string'
          ? [d.brand.trim().toUpperCase()]
          : [];
    }
    if (d.status) {
      data.status = d.status.toUpperCase() as ProductStatus;
    }
    if (d.categoryId !== undefined) {
      if (d.categoryId) {
        const catExists = await this.prisma.db.category.findUnique({
          where: { id: d.categoryId },
        });
        if (catExists) {
          data.category = { connect: { id: catExists.id } };
        } else {
          data.category = { disconnect: true };
        }
      } else {
        data.category = { disconnect: true };
      }
    }
    if (d.sellerIds !== undefined) {
      const allSellerIds: string[] = Array.isArray(d.sellerIds) ? d.sellerIds.filter(Boolean) : [];
      data.sellerIds = allSellerIds;
      const primarySellerId = d.sellerId ?? allSellerIds[0];
      if (primarySellerId && primarySellerId !== 'none') {
        const sellerExists = await this.prisma.db.seller.findUnique({
          where: { id: primarySellerId },
        });
        if (sellerExists) {
          data.seller = { connect: { id: sellerExists.id } };
        } else {
          data.seller = { disconnect: true };
        }
      } else {
        data.seller = { disconnect: true };
      }
    } else if (d.sellerId !== undefined) {
      if (d.sellerId && d.sellerId !== 'none') {
        const sellerExists = await this.prisma.db.seller.findUnique({
          where: { id: d.sellerId },
        });
        if (sellerExists) {
          data.seller = { connect: { id: sellerExists.id } };
          data.sellerIds = [sellerExists.id];
        } else {
          data.seller = { disconnect: true };
          data.sellerIds = [];
        }
      } else {
        data.seller = { disconnect: true };
        data.sellerIds = [];
      }
    }
    if (d.gender) {
      data.gender = d.gender.toUpperCase() as Gender;
    }

    if (d.price) {
      if (d.price.ogPrice !== undefined) {
        data.ogPrice = d.price.ogPrice;
      }
      if (d.price.sellingPrice !== undefined) {
        data.sellingPrice = d.price.sellingPrice;
      }
      if (d.price.gettingPrice !== undefined) {
        data.gettingPrice = d.price.gettingPrice;
      }
    }

    if (d.media) {
      if (d.media.mainImage) {
        data.mainImage = d.media.mainImage;
      }
      if (d.media.promoImage !== undefined) {
        data.promoImage = d.media.promoImage ? d.media.promoImage : null;
      } else if (d.media.mainImage) {
        // If media update is provided with mainImage but promoImage is omitted, set promoImage to null
        data.promoImage = null;
      }
      if (d.media.liveImages !== undefined) {
        data.liveImages = Array.isArray(d.media.liveImages)
          ? d.media.liveImages.filter(Boolean)
          : [];
      } else if (d.media.mainImage) {
        // If media update is provided with mainImage but liveImages is omitted, clear liveImages
        data.liveImages = [];
      }
      if (d.media.youtubeId !== undefined) {
        data.youtubeId = d.media.youtubeId ? d.media.youtubeId : null;
      }
    }

    if (d.attributes) {
      if (d.attributes.colors) {
        data.colors = d.attributes.colors;
      }
      if (d.attributes.quality) {
        data.quality =
          typeof d.attributes.quality === 'string' ? d.attributes.quality.toUpperCase() : undefined;
      }
      if (d.attributes.sizes) {
        data.sizes = Array.isArray(d.attributes.sizes)
          ? d.attributes.sizes.map((s: string) => s.trim().toUpperCase()).filter(Boolean)
          : [];
      }
    }

    if (d.inventory) {
      if (d.inventory.totalStock !== undefined) {
        data.totalStock = Math.min(100, Math.max(0, Number(d.inventory.totalStock) || 0));
      }
    }

    // Social Proof & Real-time Metrics (never negative)
    if (d.liveMatrix) {
      if (d.liveMatrix.liveWatching !== undefined) {
        data.liveWatching = Math.max(0, Number(d.liveMatrix.liveWatching) || 0);
      }
      if (d.liveMatrix.liveSold !== undefined) {
        data.liveSold = Math.max(0, Number(d.liveMatrix.liveSold) || 0);
      }
    }
    if (d.liveWatching !== undefined) {
      data.liveWatching = Math.max(0, Number(d.liveWatching) || 0);
    }
    if (d.liveSold !== undefined) {
      data.liveSold = Math.max(0, Number(d.liveSold) || 0);
    }

    if (d.rating) {
      if (d.rating.averageRating !== undefined && d.rating.averageRating !== null) {
        data.averageRating = Math.min(5, Math.max(0, Number(d.rating.averageRating) || 4.0));
      }
      if (d.rating.totalReviews !== undefined) {
        data.totalReviews = Math.max(0, Number(d.rating.totalReviews) || 0);
      }
    }
    if (d.averageRating !== undefined && d.averageRating !== null) {
      data.averageRating = Math.min(5, Math.max(0, Number(d.averageRating) || 4.0));
    }
    if (d.totalReviews !== undefined) {
      data.totalReviews = Math.max(0, Number(d.totalReviews) || 0);
    }

    if (d.marketing) {
      if (d.marketing.collections) {
        data.collections = Array.isArray(d.marketing.collections)
          ? d.marketing.collections.map((c: string) => c.trim().toUpperCase()).filter(Boolean)
          : [];
      }
      if (d.marketing.isFeatured !== undefined) {
        data.isFeatured = d.marketing.isFeatured;
      }
      if (d.marketing.seoTitle !== undefined) {
        data.seoTitle =
          typeof d.marketing.seoTitle === 'string'
            ? d.marketing.seoTitle.trim().toUpperCase()
            : null;
      }
      if (d.marketing.seoDescription !== undefined) {
        data.seoDescription =
          typeof d.marketing.seoDescription === 'string'
            ? d.marketing.seoDescription.trim().toUpperCase()
            : null;
      }
    }

    // Handle image cleanup & fetch existing product for revalidation tracking
    const existingProduct = await this.productsRepository.findById(id);
    if (
      existingProduct &&
      d.media &&
      (d.media.liveImages !== undefined || d.media.mainImage || d.media.promoImage !== undefined)
    ) {
      const oldImages = [
        existingProduct.mainImage,
        existingProduct.promoImage,
        ...(existingProduct.liveImages || []),
      ].filter((u): u is string => Boolean(u));

      // Use the actual values being persisted to database
      const finalMainImage =
        data.mainImage !== undefined ? data.mainImage : existingProduct.mainImage;
      const finalPromoImage =
        data.promoImage !== undefined ? data.promoImage : existingProduct.promoImage;
      const finalLiveImages =
        data.liveImages !== undefined ? data.liveImages : existingProduct.liveImages;

      const newImages = [
        finalMainImage,
        finalPromoImage,
        ...(Array.isArray(finalLiveImages) ? finalLiveImages : []),
      ].filter((u): u is string => Boolean(u));

      // Find images that exist in the old product but not in the new payload
      const imagesToDelete = oldImages.filter((oldUrl) => !newImages.includes(oldUrl));

      for (const url of imagesToDelete) {
        if (url && !url.includes('placeholder')) {
          await this.uploadService.deleteFile(url).catch((err) => {
            console.error(`Failed to delete orphaned image ${url} from Cloudflare:`, err);
          });
        }
      }
    }

    const result = await this.productsRepository.update(id, data);
    this.triggerProductAndCategoryRevalidation(result);
    if (existingProduct?.slug && existingProduct.slug !== result.slug) {
      void triggerRevalidation(
        `product-${existingProduct.slug}`,
        `/product/${existingProduct.slug}`,
      );
    }
    if (existingProduct?.slug && existingProduct.slug !== result.slug) {
      void triggerRevalidation(
        `product-${existingProduct.slug}`,
        `/product/${existingProduct.slug}`,
      );
    }
    return result;
  }

  async deleteProduct(id: string) {
    const existingProduct = await this.productsRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const imagesToDelete = [
      existingProduct.mainImage,
      existingProduct.promoImage,
      ...(existingProduct.liveImages || []),
    ].filter((url): url is string => Boolean(url) && typeof url === 'string');

    // 1. Delete product record from DB first
    const result = await this.productsRepository.delete(id);

    // 2. Delete all related images from Cloudflare R2 after DB deletion succeeds
    for (const url of imagesToDelete) {
      if (url && !url.includes('placeholder')) {
        await this.uploadService.deleteFile(url).catch((err) => {
          console.error(`Failed to delete product image ${url} from Cloudflare:`, err);
        });
      }
    }

    // Invalidate everything related to the deleted product so it disappears across all views
    this.triggerProductAndCategoryRevalidation(result);

    return result;
  }

  private triggerProductAndCategoryRevalidation(product: any) {
    const slug = product.slug;
    const categorySlug = product.categoryId ? product.categoryId.toLowerCase() : null;
    const gender = product.gender ? product.gender.toLowerCase() : null;

    // 1. Revalidate specific product page and product tag
    void triggerRevalidation(`product-${slug}`, `/product/${slug}`);

    // 2. Revalidate general product list tags & pages
    void triggerRevalidation('products', '/products');
    void triggerRevalidation('new-arrivals-products', '/new-arrivals');
    void triggerRevalidation('all-products');

    // 3. Revalidate brand listings
    const brands = Array.isArray(product.brand) ? product.brand : [product.brand].filter(Boolean);
    for (const b of brands) {
      if (b) {
        const brandSlug = String(b).toLowerCase();
        void triggerRevalidation(`brand-products-${brandSlug}`);
        void triggerRevalidation(`brand-products-${brandSlug}`, `/brands/${brandSlug}`);
      }
    }

    // 4. Revalidate categories and similar products
    if (categorySlug) {
      void triggerRevalidation(`similar-products-${categorySlug}`);
      void triggerRevalidation(`category-products-${categorySlug}`);
      void triggerRevalidation(`category-products-${categorySlug}`, `/categories/${categorySlug}`);
      if (gender) {
        if (gender === 'unisex') {
          void triggerRevalidation(`category-products-${categorySlug}`, `/men/${categorySlug}`);
          void triggerRevalidation(`category-products-${categorySlug}`, `/women/${categorySlug}`);
        } else {
          void triggerRevalidation(
            `category-products-${categorySlug}`,
            `/${gender}/${categorySlug}`,
          );
        }
      }
    }

    // 5. Revalidate collections if product belonged to any
    const collections: string[] = Array.isArray(product.collections) ? product.collections : [];
    for (const c of collections) {
      if (c) {
        const colSlug = c.toLowerCase().trim();
        void triggerRevalidation(`collection-products-${colSlug}`, `/collections/${colSlug}`);
      }
    }
  }

  async getProductInteractionsSummary(productIdOrSlug: string) {
    const product = await this.prisma.db.product.findFirst({
      where: { OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }] },
      select: { id: true },
    });
    const productId = product?.id || productIdOrSlug;

    const [wishlistCount, cartCount, notificationsCount, clicksCount] = await Promise.all([
      this.prisma.db.wishlistItem.count({ where: { productId } }),
      this.prisma.db.cartItem.count({ where: { productId } }),
      this.prisma.db.productNotification.count({ where: { productId } }),
      this.prisma.db.productClickLog.count({ where: { productId } }),
    ]);

    return {
      wishlistCount,
      cartCount,
      notificationsCount,
      clicksCount,
    };
  }

  async getProductInteractionsList(
    productIdOrSlug: string,
    type: 'wishlist' | 'cart' | 'notifications' | 'clicks',
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const product = await this.prisma.db.product.findFirst({
      where: { OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }] },
      select: { id: true },
    });
    const productId = product?.id || productIdOrSlug;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const userSearchWhere = search?.trim()
      ? {
          OR: [
            { name: { contains: search.trim(), mode: 'insensitive' as const } },
            { email: { contains: search.trim(), mode: 'insensitive' as const } },
            { phone: { contains: search.trim(), mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    switch (type) {
      case 'wishlist': {
        const where: any = {
          productId,
          ...(userSearchWhere ? { user: userSearchWhere } : {}),
        };
        const [total, items] = await Promise.all([
          this.prisma.db.wishlistItem.count({ where }),
          this.prisma.db.wishlistItem.findMany({
            where,
            select: {
              id: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  accountStatus: true,
                  createdAt: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: safeLimit,
            skip,
          }),
        ]);

        return {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
          data: items.map((item) => ({
            id: item.id,
            interactionType: 'wishlist' as const,
            timestamp: item.createdAt,
            user: item.user,
          })),
        };
      }

      case 'cart': {
        const where: any = {
          productId,
          ...(userSearchWhere ? { user: userSearchWhere } : {}),
        };
        const [total, items] = await Promise.all([
          this.prisma.db.cartItem.count({ where }),
          this.prisma.db.cartItem.findMany({
            where,
            select: {
              id: true,
              size: true,
              color: true,
              quantity: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  accountStatus: true,
                  createdAt: true,
                },
              },
            },
            orderBy: { updatedAt: 'desc' },
            take: safeLimit,
            skip,
          }),
        ]);

        return {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
          data: items.map((item) => ({
            id: item.id,
            interactionType: 'cart' as const,
            timestamp: item.updatedAt || item.createdAt,
            details: {
              size: item.size,
              color: item.color,
              quantity: item.quantity,
            },
            user: item.user,
          })),
        };
      }

      case 'notifications': {
        const where: any = {
          productId,
          ...(userSearchWhere ? { user: userSearchWhere } : {}),
        };
        const [total, items] = await Promise.all([
          this.prisma.db.productNotification.count({ where }),
          this.prisma.db.productNotification.findMany({
            where,
            select: {
              id: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  accountStatus: true,
                  createdAt: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: safeLimit,
            skip,
          }),
        ]);

        return {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
          data: items.map((item) => ({
            id: item.id,
            interactionType: 'notifications' as const,
            timestamp: item.createdAt,
            user: item.user,
          })),
        };
      }

      case 'clicks': {
        const where: any = {
          productId,
          ...(userSearchWhere ? { user: userSearchWhere } : {}),
        };
        const [total, items] = await Promise.all([
          this.prisma.db.productClickLog.count({ where }),
          this.prisma.db.productClickLog.findMany({
            where,
            select: {
              id: true,
              clickCount: true,
              lastClickedAt: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  accountStatus: true,
                  createdAt: true,
                },
              },
            },
            orderBy: { lastClickedAt: 'desc' },
            take: safeLimit,
            skip,
          }),
        ]);

        return {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit),
          data: items.map((item) => ({
            id: item.id,
            interactionType: 'clicks' as const,
            timestamp: item.lastClickedAt,
            details: {
              clickCount: item.clickCount,
              firstClickedAt: item.createdAt,
            },
            user: item.user,
          })),
        };
      }
    }
  }
}
