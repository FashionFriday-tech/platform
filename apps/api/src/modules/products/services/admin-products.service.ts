import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Prisma, ProductStatus, ProductCategory, Gender } from '@ff/database';

@Injectable()
export class AdminProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }

  async createProduct(dto: CreateProductDto) {
    const data: Prisma.ProductCreateInput = {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      brand: dto.brand,
      status: dto.status.toUpperCase() as ProductStatus,
      category: dto.category.toUpperCase() as ProductCategory,
      gender: dto.gender.toUpperCase() as Gender,

      // Pricing
      ogPrice: dto.price.ogPrice,
      sellingPrice: dto.price.sellingPrice,
      gettingPrice: dto.price.gettingPrice,

      // Media
      mainImage: dto.media.mainImage,
      promoImage: dto.media.promoImage,
      liveImages: dto.media.liveImages,
      youtubeId: dto.media.youtubeId,

      // Attributes
      colors: dto.attributes.colors,
      quality: dto.attributes.quality,
      sizes: dto.attributes.sizes,
      materials: dto.attributes.materials || [],
      specs: dto.attributes.specs || Prisma.DbNull,

      // Inventory
      totalStock: dto.inventory.totalStock,
      sku: dto.inventory.sku,

      // Marketing
      collections: dto.marketing.collections,
      isFeatured: dto.marketing.isFeatured,
      seoTitle: dto.marketing.seoTitle,
      seoDescription: dto.marketing.seoDescription,

      // Sellers
      sellers: dto.inventory.sellers.length > 0 ? {
        create: dto.inventory.sellers.map(s => ({
          sellerId: s.sellerId,
          gettingPrice: s.gettingPrice,
          stock: s.stock,
          isVerified: s.isVerified,
        }))
      } : undefined,
    };

    return this.productsRepository.create(data);
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
      }
    };
  }

  async getProducts(skip = 0, take = 10) {
    const result = await this.productsRepository.findAll({ skip, take });
    return this.paginate(result, skip, take);
  }

  async getProductById(id: string) {
    return this.productsRepository.findById(id);
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const data: Prisma.ProductUpdateInput = {};
    const d = dto as any;

    if (d.name) data.name = d.name;
    if (d.slug) data.slug = d.slug;
    if (d.description) data.description = d.description;
    if (d.brand) data.brand = d.brand;
    if (d.status) data.status = d.status.toUpperCase() as ProductStatus;
    if (d.category) data.category = d.category.toUpperCase() as ProductCategory;
    if (d.gender) data.gender = d.gender.toUpperCase() as Gender;

    if (d.price) {
      if (d.price.ogPrice !== undefined) data.ogPrice = d.price.ogPrice;
      if (d.price.sellingPrice !== undefined) data.sellingPrice = d.price.sellingPrice;
      if (d.price.gettingPrice !== undefined) data.gettingPrice = d.price.gettingPrice;
    }

    if (d.media) {
      if (d.media.mainImage) data.mainImage = d.media.mainImage;
      if (d.media.promoImage !== undefined) data.promoImage = d.media.promoImage;
      if (d.media.liveImages) data.liveImages = d.media.liveImages;
      if (d.media.youtubeId !== undefined) data.youtubeId = d.media.youtubeId;
    }

    if (d.attributes) {
      if (d.attributes.colors) data.colors = d.attributes.colors;
      if (d.attributes.quality) data.quality = d.attributes.quality;
      if (d.attributes.sizes) data.sizes = d.attributes.sizes;
      if (d.attributes.materials) data.materials = d.attributes.materials;
      if (d.attributes.specs !== undefined) data.specs = d.attributes.specs || Prisma.DbNull;
    }

    if (d.inventory) {
      if (d.inventory.totalStock !== undefined) data.totalStock = d.inventory.totalStock;
      if (d.inventory.sku) data.sku = d.inventory.sku;
    }

    if (d.marketing) {
      if (d.marketing.collections) data.collections = d.marketing.collections;
      if (d.marketing.isFeatured !== undefined) data.isFeatured = d.marketing.isFeatured;
      if (d.marketing.seoTitle !== undefined) data.seoTitle = d.marketing.seoTitle;
      if (d.marketing.seoDescription !== undefined) data.seoDescription = d.marketing.seoDescription;
    }

    return this.productsRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    return this.productsRepository.delete(id);
  }
}
