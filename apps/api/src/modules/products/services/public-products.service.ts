import { ProductStatus } from '@ff/database';
import { Injectable } from '@nestjs/common';

import { ProductsRepository } from '../products.repository';

function levenshteinDistance(s1: string, s2: string): number {
  const a = s1.toLowerCase();
  const b = s2.toLowerCase();
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

@Injectable()
export class PublicProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

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

  async getPublicProducts(skip = 0, take = 10, brand?: string, collection?: string) {
    const where: any = {
      status: ProductStatus.PUBLISHED,
    };

    if (brand) {
      where.brand = {
        has: brand,
      };
    }

    if (collection) {
      const decoded = decodeURIComponent(collection).trim();
      const variants = [
        decoded,
        decoded.toLowerCase(),
        decoded.replace(/-/g, ' '),
        decoded
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' '),
      ];
      where.collections = {
        hasSome: Array.from(new Set(variants.filter(Boolean))),
      };
    }

    const result = await this.productsRepository.findPublicProducts({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' as const },
    });
    return this.paginate(result, skip, take);
  }

  private cachedBrandsAndCategories?: {
    data: {
      brands: { name: string; slug: string }[];
      categories: { name: string; slug: string }[];
    };
    expiresAt: number;
  };

  private async getBrandsAndCategories() {
    const now = Date.now();
    if (this.cachedBrandsAndCategories && this.cachedBrandsAndCategories.expiresAt > now) {
      return this.cachedBrandsAndCategories.data;
    }

    const data = await this.productsRepository.findDistinctBrandsAndCategories();
    this.cachedBrandsAndCategories = {
      data,
      expiresAt: now + 5 * 60 * 1000, // 5 min TTL
    };
    return data;
  }

  private findBestTypoMatch(
    query: string,
    brands: { name: string; slug: string }[],
    categories: { name: string; slug: string }[],
  ): string | undefined {
    const clean = query.trim().toLowerCase();
    if (clean.length < 3) {
      return undefined;
    }

    const candidates = [...brands.map((b) => b.name), ...categories.map((c) => c.name)];

    let bestCandidate: string | undefined;
    let minDistance = Infinity;

    for (const candidate of candidates) {
      const dist = levenshteinDistance(clean, candidate);
      const maxAllowed = clean.length <= 4 ? 1 : clean.length <= 7 ? 2 : 3;

      if (dist <= maxAllowed && dist < minDistance) {
        minDistance = dist;
        bestCandidate = candidate;
      }
    }

    return bestCandidate;
  }

  private async executeSearch(
    searchTerm: string,
    brands: { name: string; slug: string }[],
    skip: number,
    take: number,
  ) {
    const term = searchTerm.trim();
    if (!term) {
      return { total: 0, products: [] };
    }

    // Find brands that contain this term
    const matchedBrandNames = brands
      .filter((b) => b.name.toLowerCase().includes(term.toLowerCase()))
      .map((b) => b.name);

    // Split multi-word query into distinct tokens
    const tokens = term.split(/\s+/).filter((t) => t.length > 1);

    const orConditions: any[] = [
      { name: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
      { category: { name: { contains: term, mode: 'insensitive' } } },
    ];

    if (matchedBrandNames.length > 0) {
      orConditions.push({ brand: { hasSome: matchedBrandNames } });
    }

    // If multi-word, also allow match on all words in name
    if (tokens.length > 1) {
      orConditions.push({
        AND: tokens.map((token) => ({
          OR: [
            { name: { contains: token, mode: 'insensitive' } },
            { description: { contains: token, mode: 'insensitive' } },
          ],
        })),
      });
    }

    const [total, products] = await this.productsRepository.findPublicProducts({
      skip,
      take,
      where: {
        status: ProductStatus.PUBLISHED,
        OR: orConditions,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { total, products };
  }

  async getProductsBySearch(q: string, skip = 0, take = 50) {
    const rawQuery = (q || '').trim().slice(0, 80);
    if (!rawQuery) {
      return this.paginate([0, []], skip, take);
    }

    const { brands, categories } = await this.getBrandsAndCategories();

    let { total, products } = await this.executeSearch(rawQuery, brands, skip, take);
    let didYouMean: string | undefined;

    // Typo fallback if 0 matches (e.g. "nuke" -> "Nike")
    if (total === 0) {
      const corrected = this.findBestTypoMatch(rawQuery, brands, categories);
      if (corrected && corrected.toLowerCase() !== rawQuery.toLowerCase()) {
        const typoResult = await this.executeSearch(corrected, brands, skip, take);
        if (typoResult.total > 0) {
          total = typoResult.total;
          products = typoResult.products;
          didYouMean = corrected;
        }
      }
    }

    const paginated = this.paginate([total, products], skip, take);
    return {
      ...paginated,
      meta: {
        ...paginated.meta,
        query: rawQuery,
        didYouMean,
      },
    };
  }

  async getSearchSuggestions(q?: string) {
    const rawQuery = (q || '').trim().slice(0, 80);
    const { brands, categories } = await this.getBrandsAndCategories();

    // When query is empty, provide dynamic popular brands & categories from database
    if (!rawQuery) {
      return {
        popular: [
          ...brands.slice(0, 6).map((b) => b.name),
          ...categories.slice(0, 4).map((c) => c.name),
        ],
        brands: [],
        categories: [],
        products: [],
        didYouMean: undefined,
      };
    }

    const matchingBrands = brands
      .filter((b) => b.name.toLowerCase().includes(rawQuery.toLowerCase()))
      .slice(0, 5);

    const matchingCategories = categories
      .filter((c) => c.name.toLowerCase().includes(rawQuery.toLowerCase()))
      .slice(0, 5);

    const matchedBrandNames = matchingBrands.map((b) => b.name);
    let products = await this.productsRepository.findQuickSuggestions(rawQuery, matchedBrandNames);

    let didYouMean: string | undefined;
    if (products.length === 0 && matchingBrands.length === 0 && matchingCategories.length === 0) {
      const corrected = this.findBestTypoMatch(rawQuery, brands, categories);
      if (corrected && corrected.toLowerCase() !== rawQuery.toLowerCase()) {
        didYouMean = corrected;
        const typoBrand = brands.filter((b) => b.name.toLowerCase() === corrected.toLowerCase());
        products = await this.productsRepository.findQuickSuggestions(
          corrected,
          typoBrand.map((b) => b.name),
        );
      }
    }

    return {
      brands: matchingBrands,
      categories: matchingCategories,
      products,
      didYouMean,
    };
  }

  async getFeaturedProducts(skip = 0, take = 10) {
    const result = await this.productsRepository.findPublicProducts({
      skip,
      take,
      where: {
        status: ProductStatus.PUBLISHED,
        isFeatured: true,
      },
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
        averageRating: 'desc' as const,
      },
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
          slug: categorySlug,
        },
      },
      orderBy: { createdAt: 'desc' as const },
    });
    return this.paginate(result, skip, take);
  }

  async getProductBySlug(slug: string) {
    return this.productsRepository.findBySlug(slug);
  }
}
