export interface CategoryHeroImages {
  men?: string;
  women?: string;
}

export const DEFAULT_CATEGORY_HEROES: Record<'men' | 'women', string> = {
  men: 'https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/categories/men-clothing.webp',
  women: 'https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/categories/women-clothing.webp',
};

export function extractCategoryHeroImages(campaigns?: any[]): CategoryHeroImages {
  if (!Array.isArray(campaigns) || campaigns.length === 0) {
    return {};
  }

  const categoryBanners = campaigns.filter(
    (b) => b?.placement === 'home-categories' && b?.isActive,
  );

  const menBanner = categoryBanners.find((b) => {
    const text = `${b.title || ''} ${b.linkUrl || ''}`.toLowerCase();
    return text.includes('men') && !text.includes('women');
  });

  const womenBanner = categoryBanners.find((b) => {
    const text = `${b.title || ''} ${b.linkUrl || ''}`.toLowerCase();
    return text.includes('women');
  });

  return {
    men: menBanner?.mediaUrl || menBanner?.image,
    women: womenBanner?.mediaUrl || womenBanner?.image,
  };
}
