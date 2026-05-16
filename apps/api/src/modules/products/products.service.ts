import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma, ProductStatus, ProductCategory, Gender } from '@ff/database';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

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
}
