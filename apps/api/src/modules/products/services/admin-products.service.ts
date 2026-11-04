import { Gender, generateBrandId, Prisma, ProductStatus } from '@ff/database';
import { Injectable, NotFoundException } from '@nestjs/common';

import { triggerRevalidation } from '../../revalidate-helper';
import { UploadService } from '../../upload/upload.service';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { ProductsRepository } from '../products.repository';

@Injectable()
export class AdminProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly uploadService: UploadService,
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
    const slug = (dto.slug || '').trim().toLowerCase();
    const description = (dto.description || '').trim().toUpperCase();
    const brand = Array.isArray(dto.brand)
      ? dto.brand.map((b) => b.trim().toUpperCase()).filter(Boolean)
      : dto.brand
        ? [dto.brand.trim().toUpperCase()]
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

    const data: Prisma.ProductCreateInput = {
      id: generateBrandId('PROD'),
      name,
      slug,
      description,
      brand,
      status: dto.status.toUpperCase() as ProductStatus,
      category: { connect: { id: (dto as any).categoryId } },
      sellerIds: allSellerIds,
      ...(primarySellerId ? { seller: { connect: { id: primarySellerId } } } : {}),
      gender: dto.gender.toUpperCase() as Gender,

      // Pricing
      ogPrice: dto.price.ogPrice ?? dto.price.sellingPrice ?? 0,
      sellingPrice: dto.price.sellingPrice,
      gettingPrice: dto.price.gettingPrice ?? 0,

      // Media
      mainImage: dto.media.mainImage,
      promoImage: dto.media.promoImage || null,
      liveImages: dto.media.liveImages ?? [],
      youtubeId: dto.media.youtubeId || null,

      // Attributes
      colors: dto.attributes.colors ?? [],
      quality,
      sizes,

      // Inventory
      totalStock: dto.inventory?.totalStock ?? 0,

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
      console.error('Failed to create product in database, cleaning up uploaded images:', error);
      const imagesToDelete = [
        dto.media?.mainImage,
        dto.media?.promoImage,
        ...(dto.media?.liveImages || []),
      ].filter((url): url is string => Boolean(url) && typeof url === 'string');

      for (const url of imagesToDelete) {
        if (url && !url.includes('placeholder')) {
          await this.uploadService.deleteFile(url).catch((err) => {
            console.error(`Failed to cleanup orphaned image ${url}:`, err);
          });
        }
      }
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
        data.category = { connect: { id: d.categoryId } };
      } else {
        data.category = { disconnect: true };
      }
    }
    if (d.sellerIds !== undefined) {
      const allSellerIds: string[] = Array.isArray(d.sellerIds) ? d.sellerIds.filter(Boolean) : [];
      data.sellerIds = allSellerIds;
      const primarySellerId = d.sellerId ?? allSellerIds[0];
      if (primarySellerId) {
        data.seller = { connect: { id: primarySellerId } };
      } else {
        data.seller = { disconnect: true };
      }
    } else if (d.sellerId !== undefined) {
      if (d.sellerId) {
        data.seller = { connect: { id: d.sellerId } };
        data.sellerIds = [d.sellerId];
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
        data.totalStock = Math.max(0, Number(d.inventory.totalStock) || 0);
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

    // Handle image cleanup
    if (
      d.media &&
      (d.media.liveImages !== undefined || d.media.mainImage || d.media.promoImage !== undefined)
    ) {
      const existingProduct = await this.productsRepository.findById(id);
      if (existingProduct) {
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
    }

    const result = await this.productsRepository.update(id, data);
    this.triggerProductAndCategoryRevalidation(result);
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
}
