import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { ProductStatus } from '@ff/database';

@Injectable()
export class PublicProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }

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

  async getPublicProducts(skip = 0, take = 10, brand?: string) {
    const where: any = {
      status: ProductStatus.PUBLISHED,
    };

    if (brand) {
      where.brand = {
        has: brand,
      };
    }

    const result = await this.productsRepository.findPublicProducts({
      skip,
      take,
      where,
    });
    return this.paginate(result, skip, take);
  }

  async getProductsBySearch(q: string, skip = 0, take = 10) {
    const result = await this.productsRepository.findPublicProducts({
      skip,
      take,
      where: {
        status: ProductStatus.PUBLISHED,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ]
      }
    });
    return this.paginate(result, skip, take);
  }

  async getFeaturedProducts(skip = 0, take = 10) {
    const result = await this.productsRepository.findPublicProducts({
      skip,
      take,
      where: {
        status: ProductStatus.PUBLISHED,
        isFeatured: true,
      }
    });
    return this.paginate(result, skip, take);
  }

  async getTrendingProducts(skip = 0, take = 10) {
    const result = await this.productsRepository.findPublicProducts({
      skip,
      take,
      where: {
        status: ProductStatus.PUBLISHED,
      },
      orderBy: {
        averageRating: 'desc' as const
      }
    });
    return this.paginate(result, skip, take);
  }

  async getProductsByCategory(categorySlug: string, skip = 0, take = 10) {
    const result = await this.productsRepository.findPublicProducts({
      skip,
      take,
      where: {
        status: ProductStatus.PUBLISHED,
        category: {
          slug: categorySlug
        }
      }
    });
    return this.paginate(result, skip, take);
  }

  async getProductBySlug(slug: string) {
    return this.productsRepository.findBySlug(slug);
  }
}
