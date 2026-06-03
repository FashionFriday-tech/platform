import { useEffect, useState } from 'react';

import { type Brand, type BrandCategory } from '@ff/schemas';

interface UseAddBrandModalProps {
  initialData?: Brand | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (brand: Brand, isEdit: boolean, originalSlug?: string) => void;
}

export function useAddBrandModal({ initialData, isOpen, onClose, onSave }: UseAddBrandModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState('');
  const [categories, setCategories] = useState<BrandCategory[]>([]);

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name);
      setColor(initialData.color);
      setLogoUrl(initialData.logo);

      const categoryMap: Record<string, string> = {
        sneakers: 'footwear',
        fashion: 'clothing',
        luxury: 'clothing',
        watches: 'watch',
        electronics: 'accessories',
        streetwear: 'clothing',
        sportswear: 'clothing',
      };
      const mapped = initialData.categories.map((c) => categoryMap[c] ?? c);
      setCategories([...new Set(mapped)] as BrandCategory[]);
    } else if (isOpen) {
      setName('');
      setColor('#000000');
      setLogoUrl('');
      setCategories([]);
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    onSave(
      {
        name: name.trim(),
        slug,
        color,
        logo: logoUrl.trim() ?? '/images/brand-logos/zara.png', // Default fallback
        categories: categories.length > 0 ? categories : ['clothing'],
      },
      !!initialData,
      initialData?.slug,
    );

    // Reset form
    setName('');
    setColor('#000000');
    setLogoUrl('');
    setCategories([]);
    onClose();
  };

  const toggleCategory = (cat: BrandCategory) => {
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  return {
    name,
    setName,
    color,
    setColor,
    logoUrl,
    setLogoUrl,
    categories,
    handleSave,
    toggleCategory,
  };
}
