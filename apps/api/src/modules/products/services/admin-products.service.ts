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

  async getProductStats() {
    const [total, active, draft, archived, rejected, pending] = await Promise.all([
      this.prisma.db.product.count(),
      this.prisma.db.product.count({ where: { status: ProductStatus.PUBLISHED } }),
      this.prisma.db.product.count({ where: { status: ProductStatus.DRAFT } }),
      this.prisma.db.product.count({ where: { status: ProductStatus.ARCHIVED } }),
      this.prisma.db.product.count({ where: { status: ProductStatus.REJECTED } }),
      this.prisma.db.product.count({ where: { status: ProductStatus.PENDING } }),
    ]);

    return {
      total,
      active,
      draft,
      inactive: archived + rejected + pending,
    };
  }

  async getProducts(
    skip = 0,
    take = 20,
    search?: string,
    categoryId?: string,
    status?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    minPrice?: number,
    maxPrice?: number,
    categories?: string,
    statuses?: string,
  ) {
    const trimmed = search?.trim();

    // Status filter handling
    let statusFilter: Prisma.ProductWhereInput['status'] | undefined;
    const rawStatuses = statuses || status;
    if (rawStatuses) {
      const statusTokens = rawStatuses
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const resolvedStatuses: ProductStatus[] = [];
      for (const token of statusTokens) {
        if (token === 'ACTIVE' || token === 'PUBLISHED') {
          resolvedStatuses.push(ProductStatus.PUBLISHED);
        } else if (token === 'DRAFT') {
          resolvedStatuses.push(ProductStatus.DRAFT);
        } else if (token === 'INACTIVE' || token === 'ARCHIVED') {
          resolvedStatuses.push(
            ProductStatus.ARCHIVED,
            ProductStatus.REJECTED,
            ProductStatus.PENDING,
          );
        }
      }

      if (resolvedStatuses.length > 0) {
        statusFilter = { in: Array.from(new Set(resolvedStatuses)) };
      }
    }

    // Category filter handling
    let categoryFilter: Prisma.ProductWhereInput['category'] | undefined;
    let directCategoryId: string | undefined = categoryId;
    const rawCategories = categories;
    if (rawCategories) {
      const catTokens = rawCategories
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (catTokens.length > 0) {
        categoryFilter = {
          name: { in: catTokens, mode: 'insensitive' },
        };
        directCategoryId = undefined;
      }
    }

    // Price filter handling
    let priceFilter: Prisma.DecimalFilter | undefined;
    if (minPrice !== undefined || maxPrice !== undefined) {
      priceFilter = {
        ...(minPrice !== undefined && !isNaN(minPrice) ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined && !isNaN(maxPrice) ? { lte: maxPrice } : {}),
      };
    }

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
      ...(directCategoryId ? { categoryId: directCategoryId } : {}),
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(priceFilter ? { sellingPrice: priceFilter } : {}),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy === 'price') {
      orderBy = { sellingPrice: sortOrder || 'asc' };
    } else if (sortBy === 'name') {
      orderBy = { name: sortOrder || 'asc' };
    } else if (sortBy === 'stock') {
      orderBy = { totalStock: sortOrder || 'desc' };
    } else if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder || 'desc' };
    }

    const result = await this.productsRepository.findAll({ skip, take, where, orderBy });
    return this.paginate(result, skip, take);
  }

  async getProductById(idOrSlug: string) {
    if (!idOrSlug) return null;
    const byId = await this.productsRepository.findById(idOrSlug);
    if (byId) {
      return byId;
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

    // Fetch actual order items for this product (only confirmed orders)
    const orderItems = await this.prisma.db.orderItem.findMany({
      where: {
        productId,
        order: {
          status: { notIn: ['CANCELLED', 'RETURNED', 'REFUNDED'] },
        },
      },
      select: {
        quantity: true,
        createdAt: true,
        order: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    // Fetch real interaction logs
    const [clickLogs, cartItems, wishlistItems] = await Promise.all([
      this.prisma.db.productClickLog.findMany({
        where: { productId },
        select: { createdAt: true, clickCount: true },
      }),
      this.prisma.db.cartItem.findMany({
        where: { productId },
        select: { createdAt: true },
      }),
      this.prisma.db.wishlistItem.findMany({
        where: { productId },
        select: { createdAt: true },
      }),
    ]);

    // Helper: count items in a date range
    const countInRange = (items: { createdAt: Date }[], start: Date, end: Date) =>
      items.filter((item) => {
        const d = new Date(item.createdAt);
        return d >= start && d < end;
      }).length;

    // Helper: sum order quantities in a date range
    const salesInRange = (start: Date, end: Date) =>
      orderItems
        .filter((item) => {
          const d = item.order?.createdAt
            ? new Date(item.order.createdAt)
            : new Date(item.createdAt);
          return d >= start && d < end;
        })
        .reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Helper: sum click counts in a date range
    const clicksInRange = (start: Date, end: Date) =>
      clickLogs
        .filter((log) => {
          const d = new Date(log.createdAt);
          return d >= start && d < end;
        })
        .reduce((sum, log) => sum + (log.clickCount || 1), 0);

    // Views = clicks + cart adds + wishlist adds (real engagement signals)
    const viewsInRange = (start: Date, end: Date) =>
      clicksInRange(start, end) +
      countInRange(cartItems, start, end) +
      countInRange(wishlistItems, start, end);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    // 1. DAILY (Last 7 Days)
    const dailyPoints: { label: string; sales: number; views: number; date: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

      dailyPoints.push({
        label: dayNames[start.getDay()],
        sales: salesInRange(start, end),
        views: viewsInRange(start, end),
        date: start.toISOString().split('T')[0],
      });
    }

    // 2. WEEKLY (Past 5 Weeks)
    const weeklyPoints: { label: string; sales: number; views: number; date: string }[] = [];
    for (let i = 4; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 86400000);
      const weekEnd = new Date(now.getTime() - i * 7 * 86400000);

      weeklyPoints.push({
        label: `W${5 - i}`,
        sales: salesInRange(weekStart, weekEnd),
        views: viewsInRange(weekStart, weekEnd),
        date: weekStart.toISOString().split('T')[0],
      });
    }

    // 3. MONTHLY (Last 7 Months)
    const monthlyPoints: { label: string; sales: number; views: number; date: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      monthlyPoints.push({
        label: monthNames[mStart.getMonth()],
        sales: salesInRange(mStart, mEnd),
        views: viewsInRange(mStart, mEnd),
        date: `${mStart.getFullYear()}-${String(mStart.getMonth() + 1).padStart(2, '0')}`,
      });
    }

    // 4. YEARLY (Past 3 Years)
    const yearlyPoints: { label: string; sales: number; views: number; date: string }[] = [];
    const currentYear = now.getFullYear();
    const startYear = Math.max(2023, currentYear - 2);
    for (let y = startYear; y <= currentYear; y++) {
      const yStart = new Date(y, 0, 1);
      const yEnd = new Date(y + 1, 0, 1);

      yearlyPoints.push({
        label: String(y),
        sales: salesInRange(yStart, yEnd),
        views: viewsInRange(yStart, yEnd),
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
