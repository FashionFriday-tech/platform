import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Prisma, ProductStatus, ProductCategory, Gender } from '@ff/database';
import { UploadService } from '../../upload/upload.service';

@Injectable()
export class AdminProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly uploadService: UploadService,
  ) { }

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

      // Inventory
      totalStock: dto.inventory.totalStock,

      // Marketing
      collections: dto.marketing.collections,
      isFeatured: dto.marketing.isFeatured,
      seoTitle: dto.marketing.seoTitle,
      seoDescription: dto.marketing.seoDescription,
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
    }

    if (d.inventory) {
      if (d.inventory.totalStock !== undefined) data.totalStock = d.inventory.totalStock;
    }

    if (d.marketing) {
      if (d.marketing.collections) data.collections = d.marketing.collections;
      if (d.marketing.isFeatured !== undefined) data.isFeatured = d.marketing.isFeatured;
      if (d.marketing.seoTitle !== undefined) data.seoTitle = d.marketing.seoTitle;
      if (d.marketing.seoDescription !== undefined) data.seoDescription = d.marketing.seoDescription;
    }

    // Handle image cleanup
    if (d.media && (d.media.liveImages || d.media.mainImage || d.media.promoImage)) {
      const existingProduct = await this.productsRepository.findById(id);
      if (existingProduct) {
        const oldImages = [existingProduct.mainImage, existingProduct.promoImage, ...(existingProduct.liveImages as string[] || [])].filter(Boolean);
        const newImages = [d.media.mainImage, d.media.promoImage, ...(d.media.liveImages || [])].filter(Boolean);
        
        // Find images that exist in the old product but not in the new payload
        const imagesToDelete = oldImages.filter(oldUrl => !newImages.includes(oldUrl));
        
        for (const url of imagesToDelete) {
          if (url) await this.uploadService.deleteFile(url);
        }
      }
    }

    return this.productsRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const existingProduct = await this.productsRepository.findById(id);
    if (existingProduct) {
      const imagesToDelete = [existingProduct.mainImage, existingProduct.promoImage, ...(existingProduct.liveImages as string[] || [])].filter(Boolean);
      for (const url of imagesToDelete) {
        if (url) await this.uploadService.deleteFile(url);
      }
    }
    
    return this.productsRepository.delete(id);
  }
}
