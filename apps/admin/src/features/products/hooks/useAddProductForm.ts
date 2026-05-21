import { useEffect, useRef, useState } from 'react';

import { BRAND_LOGOS, type BrandCategory, MAJOR_COLORS, type Product } from '@ff/schemas';

import { SIZE_MAP } from '../utils/constants';

export function useAddProductForm(initialData?: Product) {
  const [sizes, setSizes] = useState<string[]>(SIZE_MAP['Jacket'] || []);
  const [gender, setGender] = useState<string>('Woman');
  const [category, setCategory] = useState<string>('Jacket');
  const [quality, setQuality] = useState<string>('Original');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [brandInput, setBrandInput] = useState('');
  const [selectedBrandLogo, setSelectedBrandLogo] = useState<string | null>(null);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const [colorInput, setColorInput] = useState('');
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(null);
  const [isColorOpen, setIsColorOpen] = useState(false);

  const [videoLink, setVideoLink] = useState('');
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isQualityOpen, setIsQualityOpen] = useState(false);

  // Form Fields
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [ogPrice, setOgPrice] = useState('');
  const [stock, setStock] = useState('');
  const [gettingPrice, setGettingPrice] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoSlug, setSeoSlug] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoError, setSeoError] = useState('');

  // Media
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const categoryRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  // Prepopulate data if editing
  useEffect(() => {
    if (initialData) {
      // Map Gender
      let mappedGender = 'Woman';
      if (initialData.gender === 'MEN') mappedGender = 'Men';
      if (initialData.gender === 'WOMEN') mappedGender = 'Woman';
      if (initialData.gender === 'UNISEX') mappedGender = 'Unisex';

      // Map Quality
      let mappedUIQuality: string = initialData.attributes?.quality || 'Original';
      if (mappedUIQuality === 'UA') mappedUIQuality = 'Original';
      if (mappedUIQuality === 'STANDARD') mappedUIQuality = '5A';

      // Map Category
      let mappedCategory = 'Jacket'; // default fallback for CLOTHING
      if (initialData.category === 'SNEAKERS') mappedCategory = 'Sneakers';
      else if (initialData.category === 'WATCHES') mappedCategory = 'Watches';
      else if (initialData.category === 'ACCESSORIES') mappedCategory = 'Accessories';
      
      // Try to infer specific clothing type from tags
      if (initialData.category === 'CLOTHING') {
        const tags = initialData.marketing?.collections || [];
        if (tags.some(t => t.toLowerCase() === 'shirts' || t.toLowerCase() === 'shirt')) mappedCategory = 'Shirts';
        else if (tags.some(t => t.toLowerCase() === 'pants' || t.toLowerCase() === 'pant')) mappedCategory = 'Pants';
        else if (tags.some(t => t.toLowerCase() === 'jacket' || t.toLowerCase() === 'jackets')) mappedCategory = 'Jacket';
      }

      // Core fields
      setProductName(initialData.name || '');
      setProductDesc(initialData.description || '');
      setCategory(mappedCategory);
      setQuality(mappedUIQuality);
      setGender(mappedGender);
      setBrandInput(initialData.brand?.[0] || '');
      if (initialData.brand?.[0]) {
        setSelectedBrandLogo(initialData.brand[0].charAt(0).toUpperCase());
      }
      setBasePrice(initialData.price?.sellingPrice?.toString() || '');
      setOgPrice(initialData.price?.ogPrice?.toString() || '');
      setStock(initialData.inventory?.totalStock?.toString() || '');
      setGettingPrice(initialData.price?.gettingPrice?.toString() || '');
      setSizes(initialData.attributes?.sizes && initialData.attributes.sizes.length > 0 ? initialData.attributes.sizes : SIZE_MAP[mappedCategory] || SIZE_MAP['Jacket'] || []);

      // Color — reverse-map from hex to color name
      const savedColorHex = initialData.attributes?.colors?.[0];
      if (savedColorHex) {
        const matchedColor = MAJOR_COLORS.find(c => c.hex.toLowerCase() === savedColorHex.toLowerCase());
        setColorInput(matchedColor ? matchedColor.name : savedColorHex);
        setSelectedColorHex(savedColorHex);
      }

      // Video — convert youtubeId back to a watchable URL
      const savedYoutubeId = (initialData.media as any)?.youtubeId;
      if (savedYoutubeId) {
        setVideoLink(`https://www.youtube.com/watch?v=${savedYoutubeId}`);
      }

      // Tags / SEO
      setTags(initialData.marketing?.collections || []);
      setSeoTitle(initialData.marketing?.seoTitle || '');
      setSeoDesc(initialData.marketing?.seoDescription || '');
      setSeoSlug(initialData.slug || '');

      // Images — load ALL images (mainImage + promoImage + liveImages) into form state
      setImagesToDelete([]);
      const uniquePrefix = Math.random().toString(36).substring(7);
      const allImages: { id: string; url: string }[] = [];

      if (initialData.media?.mainImage) {
        allImages.push({ id: `init-${uniquePrefix}-main`, url: initialData.media.mainImage });
      }
      if ((initialData.media as any)?.promoImage) {
        allImages.push({ id: `init-${uniquePrefix}-promo`, url: (initialData.media as any).promoImage });
      }
      if (initialData.media?.liveImages && initialData.media.liveImages.length > 0) {
        initialData.media.liveImages.forEach((url, i) => {
          allImages.push({ id: `init-${uniquePrefix}-live-${i}`, url });
        });
      }

      setImages(allImages.length > 0 ? allImages : []);
    }
  }, [initialData]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (qualityRef.current && !qualityRef.current.contains(event.target as Node)) {
        setIsQualityOpen(false);
      }
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setIsColorOpen(false);
      }
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) {
        setIsBrandOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync YouTube Video link dynamically
  useEffect(() => {
    if (!videoLink.trim()) {
      setEmbedUrl(null);
      return;
    }
    const shortsRegex = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;
    const watchRegex = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const youtuBeRegex = /youtu\.be\/([a-zA-Z0-9_-]+)/;

    let id = null;
    if (shortsRegex.exec(videoLink)) {
      id = shortsRegex.exec(videoLink)![1];
    } else if (watchRegex.exec(videoLink)) {
      id = watchRegex.exec(videoLink)![1];
    } else if (youtuBeRegex.exec(videoLink)) {
      id = youtuBeRegex.exec(videoLink)![1];
    }

    if (id) {
      setVideoId(id);
      setEmbedUrl(
        `https://www.youtube.com/embed/${id}?controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&autoplay=1`,
      );
    } else {
      setVideoId(null);
      setEmbedUrl(null);
    }
  }, [videoLink]);

  const handleCategorySelect = (c: string) => {
    setCategory(c);
    setIsCategoryOpen(false);
    setSizes(SIZE_MAP[c] || []);
    setBrandInput(''); // Reset brand when category changes
    setSelectedBrandLogo(null);
  };

  const toggleSize = (s: string) => {
    setSizes((prev) => (prev.includes(s) ? prev.filter((sz) => sz !== s) : [...prev, s]));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const generateSEO = () => {
    if (!productName.trim() || !productDesc.trim()) {
      setSeoError('Info not available.');
      return;
    }
    setSeoError('');
    const slug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSeoSlug(slug);
    setSeoTitle(`Buy ${productName} - Fashion Friday`);
    setSeoDesc(
      `Shop the latest ${productName}. ${productDesc.substring(0, 50)}... Fast shipping, great deals, and premium materials. Buy now at Fashion Friday.`,
    );

    // Auto-generate tags based on general info
    const newTags = new Set([
      ...tags,
      category.toLowerCase(),
      quality.toLowerCase(),
      'fashion',
      'trendy',
    ]);
    if (colorInput.trim()) {
      newTags.add(colorInput.toLowerCase().trim());
    }
    if (brandInput.trim()) {
      newTags.add(brandInput.toLowerCase().trim());
    }
    setTags(Array.from(newTags));
  };

  const [isUploading, setIsUploading] = useState(false);
  const [cropQueue, setCropQueue] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setCropQueue((prev) => [...prev, ...newFiles]);
    }
  };

  const uploadCroppedImage = async (croppedBlob: Blob, originalName: string, productName?: string) => {
    setIsUploading(true);
    try {
      const fileExtension = originalName.split('.').pop() || 'webp';
      const file = new File([croppedBlob], originalName, {
        type: 'image/webp',
      });

      const formData = new FormData();
      formData.append('file', file);
      if (productName) {
        formData.append('slug', productName);
      }
      formData.append('folder', 'products');

      const res = await fetch('http://localhost:3002/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload Error:', res.status, errorText);
        throw new Error(`Failed to upload image: ${errorText}`);
      }

      const data = await res.json();
      setImages((prev) => {
        const combined = [...prev, {
          id: Math.random().toString(36).substring(7),
          url: data.url,
        }];
        return combined.slice(0, 10);
      });

      // Remove the completed file from crop queue
      setCropQueue((prev) => prev.slice(1));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropCancel = () => {
    // Remove the current file from queue on cancel
    setCropQueue((prev) => prev.slice(1));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      const temp = newImages[fromIndex];
      newImages[fromIndex] = newImages[toIndex];
      newImages[toIndex] = temp;
      return newImages;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Firefox requires setting data in dragStart
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === toIndex) {
      return;
    }

    setImages((prev) => {
      const newImages = [...prev];
      const temp = newImages[draggedIndex];
      newImages[draggedIndex] = newImages[toIndex];
      newImages[toIndex] = temp;
      return newImages;
    });
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const [imagesToDelete, setImagesToDelete] = useState<{ id: string; url: string }[]>([]);

  const removeImage = (idToRemove: string) => {
    const imgToRemove = images.find((img) => img.id === idToRemove);
    if (imgToRemove) {
      setImagesToDelete((delPrev) => {
        if (delPrev.some((img) => img.id === idToRemove)) return delPrev;
        return [...delPrev, imgToRemove];
      });
    }
    setImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const restoreImage = (idToRestore: string) => {
    const imgToRestore = imagesToDelete.find((img) => img.id === idToRestore);
    if (imgToRestore) {
      setImages((imgPrev) => {
        if (imgPrev.some((img) => img.id === idToRestore)) return imgPrev;
        return [...imgPrev, imgToRestore];
      });
    }
    setImagesToDelete((prev) => prev.filter((img) => img.id !== idToRestore));
  };

  const filteredColors = MAJOR_COLORS.filter((c) =>
    c.name.toLowerCase().includes(colorInput.toLowerCase()),
  );
  const availableSizes = SIZE_MAP[category] || SIZE_MAP.Jacket;

  const categoryToBrandCategory: Record<string, BrandCategory[]> = {
    Jacket: ['clothing'],
    Shirts: ['clothing'],
    Sneakers: ['footwear'],
    Pants: ['clothing'],
  };
  const availableBrands = BRAND_LOGOS.filter((b) =>
    b.categories.some((c) => categoryToBrandCategory[category]?.includes(c)),
  );
  const filteredBrands = availableBrands.filter((b) =>
    b.name.toLowerCase().includes(brandInput.toLowerCase()),
  );

  // Progress tracking
  const getProgress = () => {
    const fields = [
      productName,
      productDesc,
      brandInput,
      colorInput,
      basePrice,
      ogPrice,
      stock,
      gettingPrice,
      images.length > 0 ? 'filled' : '',
      videoLink,
      tags.length > 0 ? 'filled' : '',
      seoSlug,
      seoTitle,
      seoDesc,
    ];
    const filled = fields.filter((f) =>
      typeof f === 'string' ? f.trim() !== '' : f !== '',
    ).length;
    return { filled, total: fields.length };
  };

  const progress = getProgress();

  return {
    sizes,
    toggleSize,
    gender,
    setGender,
    category,
    setCategory,
    handleCategorySelect,
    quality,
    setQuality,
    tags,
    setTags,
    tagInput,
    setTagInput,
    handleTagKeyDown,
    removeTag,
    brandInput,
    setBrandInput,
    selectedBrandLogo,
    setSelectedBrandLogo,
    isBrandOpen,
    setIsBrandOpen,
    colorInput,
    setColorInput,
    selectedColorHex,
    setSelectedColorHex,
    isColorOpen,
    setIsColorOpen,
    videoLink,
    setVideoLink,
    embedUrl,
    videoId,
    isCategoryOpen,
    setIsCategoryOpen,
    isQualityOpen,
    setIsQualityOpen,
    productName,
    setProductName,
    productDesc,
    setProductDesc,
    basePrice,
    setBasePrice,
    ogPrice,
    setOgPrice,
    stock,
    setStock,
    gettingPrice,
    setGettingPrice,
    seoTitle,
    setSeoTitle,
    seoSlug,
    setSeoSlug,
    seoDesc,
    setSeoDesc,
    seoError,
    generateSEO,
    fileInputRef,
    images,
    draggedIndex,
    categoryRef,
    qualityRef,
    colorRef,
    brandRef,
    handleImageUpload,
    handleReorder,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    removeImage,
    filteredColors,
    availableSizes,
    filteredBrands,
    progress,
    isUploading,
    imagesToDelete,
    restoreImage,
    cropQueue,
    uploadCroppedImage,
    handleCropCancel,
  };
}
