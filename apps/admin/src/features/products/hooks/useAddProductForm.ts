import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { type Product } from '@ff/schemas';

import { useBrands } from '../../brands/hooks/useBrands';
import { useCategories } from '../../categories/hooks/useCategories';
import { useColors } from '../../colors/hooks/useColors';
import { type CreateColorInput } from '../../colors/types';
import { getCategorySizes } from '../utils/constants';
import { autoCropImageTo3x4 } from '../utils/imageCrop';

export interface SelectedColor {
  name: string;
  hex: string;
}

export interface UseAddProductFormOptions {
  onToast?: (toast: { message: string; type: 'success' | 'error' | 'warning' }) => void;
}

export function useAddProductForm(initialData?: Product, options?: UseAddProductFormOptions) {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const searchParams = useSearchParams();
  const paramCategoryId = searchParams?.get('categoryId') ?? null;
  const paramCategoryName = searchParams?.get('categoryName') ?? null;
  const paramGender = searchParams?.get('gender') ?? null;

  const { categories: apiCategories } = useCategories();
  const { brands: apiBrands } = useBrands();
  const { colors: apiColors, handleSaveColor: saveColorToApi } = useColors();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialData?.categoryId ?? (initialData as any)?.category?.id ?? paramCategoryId,
  );
  const [gender, setGender] = useState<string>(() => {
    if (initialData?.gender === 'MEN') {
      return 'Men';
    }
    if (initialData?.gender === 'WOMEN') {
      return 'Woman';
    }
    if (paramGender === 'Men' || paramGender === 'Women') {
      return paramGender === 'Women' ? 'Woman' : 'Men';
    }
    return 'Unisex';
  });
  const [sizes, setSizes] = useState<string[]>(() =>
    getCategorySizes(
      paramCategoryName ?? (initialData as any)?.category?.name,
      initialData?.gender ?? paramGender ?? 'Unisex',
    ),
  );
  const [category, setCategory] = useState<string>(
    paramCategoryName ?? (initialData as any)?.category?.name ?? '',
  );
  const [quality, setQuality] = useState<string>('Original');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [brandInput, setBrandInput] = useState('');
  const [selectedBrandLogo, setSelectedBrandLogo] = useState<string | null>(null);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const [colorInput, setColorInput] = useState('');
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<SelectedColor[]>([]);
  const [isColorOpen, setIsColorOpen] = useState(false);

  const toggleColor = (color: { name: string; hex: string }) => {
    setSelectedColors((prev) => {
      const exists = prev.some(
        (c) =>
          c.hex.toLowerCase() === color.hex.toLowerCase() ||
          c.name.toLowerCase() === color.name.toLowerCase(),
      );
      if (exists) {
        return prev.filter(
          (c) =>
            c.hex.toLowerCase() !== color.hex.toLowerCase() &&
            c.name.toLowerCase() !== color.name.toLowerCase(),
        );
      }
      return [...prev, { name: color.name.trim(), hex: color.hex.trim().toUpperCase() }];
    });
  };

  const removeColor = (colorNameOrHex: string) => {
    setSelectedColors((prev) =>
      prev.filter(
        (c) =>
          c.hex.toLowerCase() !== colorNameOrHex.toLowerCase() &&
          c.name.toLowerCase() !== colorNameOrHex.toLowerCase(),
      ),
    );
  };

  const [isAddColorModalOpen, setIsAddColorModalOpen] = useState(false);
  const [newColorDefaultName, setNewColorDefaultName] = useState('');
  const [newColorDefaultHex, setNewColorDefaultHex] = useState('#000000');
  const [isSavingNewColor, setIsSavingNewColor] = useState(false);

  const openAddColorModal = (initialQuery?: string) => {
    const q = initialQuery?.trim() || '';
    if (q.startsWith('#')) {
      setNewColorDefaultHex(q.toUpperCase());
      setNewColorDefaultName('');
    } else {
      setNewColorDefaultName(q);
      setNewColorDefaultHex('#000000');
    }
    setIsAddColorModalOpen(true);
    setIsColorOpen(false);
  };

  const closeAddColorModal = () => {
    setIsAddColorModalOpen(false);
    setNewColorDefaultName('');
    setNewColorDefaultHex('#000000');
  };

  const handleCreateAndSelectColor = async (input: CreateColorInput) => {
    setIsSavingNewColor(true);
    try {
      const created = await saveColorToApi(input);
      if (created) {
        toggleColor({ name: created.name, hex: created.hex });
        setColorInput('');
      }
      closeAddColorModal();
    } finally {
      setIsSavingNewColor(false);
    }
  };

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

  // Social Proof & Metric Counts (never negative)
  // Randomized on creation: liveWatching (1000 - 10000), liveSold (0 - 100), averageRating defaults to 4.5
  const [liveWatching, setLiveWatching] = useState(() =>
    initialData?.liveMatrix?.liveWatching !== undefined
      ? initialData.liveMatrix.liveWatching.toString()
      : (Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000).toString(),
  );
  const [liveSold, setLiveSold] = useState(() =>
    initialData?.liveMatrix?.liveSold !== undefined
      ? initialData.liveMatrix.liveSold.toString()
      : Math.floor(Math.random() * 101).toString(),
  );
  const [averageRating, setAverageRating] = useState(() =>
    initialData?.rating?.averageRating !== undefined
      ? initialData.rating.averageRating.toString()
      : '4.5',
  );
  const [totalReviews, setTotalReviews] = useState(() =>
    initialData?.rating?.totalReviews !== undefined
      ? initialData.rating.totalReviews.toString()
      : '0',
  );

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoSlug, setSeoSlug] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoError, setSeoError] = useState('');

  // Media
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<{ id: string; url: string; file?: File; isNew?: boolean }[]>(
    [],
  );
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  const [imagesToDelete, setImagesToDelete] = useState<{ id: string; url: string }[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const categoryRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  // Prepopulate data if editing
  useEffect(() => {
    if (initialData) {
      // Map Gender
      let mappedGender = 'Unisex';
      if (initialData.gender === 'MEN') {
        mappedGender = 'Men';
      }
      if (initialData.gender === 'WOMEN') {
        mappedGender = 'Woman';
      }
      if (initialData.gender === 'UNISEX') {
        mappedGender = 'Unisex';
      }

      // Map Quality
      let mappedUIQuality: string = initialData.attributes?.quality ?? 'Original';
      if (mappedUIQuality === 'UA') {
        mappedUIQuality = 'Original';
      }
      if (mappedUIQuality === 'STANDARD') {
        mappedUIQuality = '5A';
      }

      // Map Category from apiCategories or attached category object
      const catId = initialData.categoryId || (initialData as any).category?.id;
      let matchedCategoryName = '';
      if (catId) {
        setSelectedCategoryId(catId);
        const foundCategory = apiCategories.find((c) => c.id === catId || c.slug === catId);
        if (foundCategory) {
          matchedCategoryName = foundCategory.name;
        }
      }
      if (!matchedCategoryName && (initialData as any).category?.name) {
        matchedCategoryName = (initialData as any).category.name;
      }
      if (matchedCategoryName) {
        setCategory(matchedCategoryName);
      }

      // Core fields
      setProductName(initialData.name ?? '');
      setProductDesc(initialData.description ?? '');
      setQuality(mappedUIQuality);
      setGender(mappedGender);
      setBrandInput(initialData.brand?.[0] ?? '');
      if (initialData.brand?.[0]) {
        setSelectedBrandLogo(initialData.brand[0].charAt(0).toUpperCase());
      }
      setBasePrice(initialData.price?.sellingPrice?.toString() ?? '');
      setOgPrice(initialData.price?.ogPrice?.toString() ?? '');
      setStock(initialData.inventory?.totalStock?.toString() ?? '');
      setGettingPrice(initialData.price?.gettingPrice?.toString() ?? '');

      // Engagement & Live Metrics
      setLiveWatching(
        initialData.liveMatrix?.liveWatching !== undefined
          ? initialData.liveMatrix.liveWatching.toString()
          : (initialData as any).liveWatching !== undefined
            ? (initialData as any).liveWatching.toString()
            : (Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000).toString(),
      );
      setLiveSold(
        initialData.liveMatrix?.liveSold !== undefined
          ? initialData.liveMatrix.liveSold.toString()
          : (initialData as any).liveSold !== undefined
            ? (initialData as any).liveSold.toString()
            : Math.floor(Math.random() * 101).toString(),
      );
      setAverageRating(
        initialData.rating?.averageRating !== undefined
          ? initialData.rating.averageRating.toString()
          : (initialData as any).averageRating !== undefined
            ? (initialData as any).averageRating.toString()
            : '4.5',
      );
      setTotalReviews(
        initialData.rating?.totalReviews !== undefined
          ? initialData.rating.totalReviews.toString()
          : (initialData as any).totalReviews !== undefined
            ? (initialData as any).totalReviews.toString()
            : '0',
      );

      const isWatch = matchedCategoryName?.toLowerCase().includes('watch');
      const rawSizes = initialData.attributes?.sizes;
      const initialSizes =
        rawSizes && rawSizes.length > 0
          ? rawSizes.map((s) =>
              isWatch && (s.toUpperCase() === 'ONE SIZE' || s.toUpperCase() === 'OS')
                ? 'Free Size'
                : s,
            )
          : getCategorySizes(matchedCategoryName);
      setSizes(initialSizes);

      // Colors — reverse-map from hex or name to array of SelectedColor
      const savedColorsList = initialData.attributes?.colors;
      if (Array.isArray(savedColorsList) && savedColorsList.length > 0) {
        const mappedColors: SelectedColor[] = savedColorsList.map((saved) => {
          const matched = apiColors.find(
            (c) =>
              c.hex.toLowerCase() === saved.toLowerCase() ||
              c.name.toLowerCase() === saved.toLowerCase(),
          );
          return {
            name: matched ? matched.name : saved,
            hex: matched ? matched.hex : saved.startsWith('#') ? saved.toUpperCase() : '#000000',
          };
        });
        setSelectedColors(mappedColors);
        if (mappedColors[0]) {
          setColorInput(mappedColors[0].name);
          setSelectedColorHex(mappedColors[0].hex);
        }
      }

      // Video — convert youtubeId back to a watchable URL
      const savedYoutubeId = (initialData.media as { youtubeId?: string } | undefined)?.youtubeId;
      if (savedYoutubeId) {
        setVideoLink(`https://www.youtube.com/watch?v=${savedYoutubeId}`);
      }

      // Tags / SEO
      setTags(initialData.marketing?.collections ?? []);
      setSeoTitle(initialData.marketing?.seoTitle ?? '');
      setSeoDesc(initialData.marketing?.seoDescription ?? '');
      setSeoSlug(initialData.slug ?? '');

      // Images — load ALL images (mainImage + promoImage + liveImages) into form state
      setImagesToDelete([]);
      const uniquePrefix = Math.random().toString(36).substring(7);
      const allImages: { id: string; url: string }[] = [];

      const media = initialData.media as
        | { mainImage?: string; promoImage?: string; liveImages?: string[] }
        | undefined;
      if (media?.mainImage) {
        allImages.push({ id: `init-${uniquePrefix}-main`, url: media.mainImage });
      }
      if (media?.promoImage) {
        allImages.push({
          id: `init-${uniquePrefix}-promo`,
          url: media.promoImage,
        });
      }
      if (initialData.media?.liveImages && initialData.media.liveImages.length > 0) {
        for (const [i, url] of initialData.media.liveImages.entries()) {
          allImages.push({ id: `init-${uniquePrefix}-live-${i}`, url });
        }
      }

      if (allImages.length === 0) {
        if ((initialData as any).imageUrl) {
          allImages.push({ id: `init-${uniquePrefix}-main`, url: (initialData as any).imageUrl });
        }
        if (Array.isArray((initialData as any).images)) {
          for (const [i, url] of ((initialData as any).images as string[]).entries()) {
            if (!allImages.some((img) => img.url === url)) {
              allImages.push({ id: `init-${uniquePrefix}-${i}`, url });
            }
          }
        }
      }

      setImages(allImages.length > 0 ? allImages : []);
    }
  }, [initialData, apiCategories, apiColors]);

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
    const trimmed = videoLink.trim();
    if (!trimmed) {
      setEmbedUrl(null);
      setVideoId(null);
      return;
    }
    const shortsRegex = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;
    const watchRegex = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const youtuBeRegex = /youtu\.be\/([a-zA-Z0-9_-]+)/;
    const embedRegex = /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/;

    let id: string | null = null;
    if (shortsRegex.exec(trimmed)) {
      id = shortsRegex.exec(trimmed)![1];
    } else if (watchRegex.exec(trimmed)) {
      id = watchRegex.exec(trimmed)![1];
    } else if (youtuBeRegex.exec(trimmed)) {
      id = youtuBeRegex.exec(trimmed)![1];
    } else if (embedRegex.exec(trimmed)) {
      id = embedRegex.exec(trimmed)![1];
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      id = trimmed;
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

  const handleCategorySelect = (
    idOrCategory: string | { id: string; name: string },
    maybeName?: string,
  ) => {
    let catId = '';
    let catName = '';

    if (typeof idOrCategory === 'object') {
      catId = idOrCategory.id;
      catName = idOrCategory.name;
    } else if (maybeName) {
      catId = idOrCategory;
      catName = maybeName;
    } else {
      const found = apiCategories.find(
        (c) => c.id === idOrCategory || c.name.toLowerCase() === idOrCategory.toLowerCase(),
      );
      if (found) {
        catId = found.id;
        catName = found.name;
      } else {
        catName = idOrCategory;
      }
    }

    if (catId) {
      setSelectedCategoryId(catId);
    }
    setCategory(catName);
    setIsCategoryOpen(false);
    setSizes(getCategorySizes(catName, gender));
    setBrandInput('');
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
    if (selectedColors.length > 0) {
      selectedColors.forEach((sc) => newTags.add(sc.name.toLowerCase().trim()));
    } else if (colorInput.trim()) {
      newTags.add(colorInput.toLowerCase().trim());
    }
    if (brandInput.trim()) {
      newTags.add(brandInput.toLowerCase().trim());
    }
    setTags(Array.from(newTags));
  };

  const [isUploading, setIsUploading] = useState(false);
  const [originalFiles, setOriginalFiles] = useState<Record<string, File>>({});

  const processImageFiles = async (
    files: (File | Blob)[],
    defaultPrefix = 'pasted-image',
  ): Promise<number> => {
    if (!files || files.length === 0) {
      return 0;
    }

    const currentCount = imagesRef.current.length;
    if (currentCount >= 10) {
      optionsRef.current?.onToast?.({
        message: 'Maximum limit of 10 images reached.',
        type: 'warning',
      });
      return 0;
    }

    const availableSlots = 10 - currentCount;
    const filesToProcess = files.slice(0, availableSlots);

    setIsUploading(true);
    try {
      const newImages: { id: string; url: string; file: File; isNew: boolean }[] = [];
      const newOriginalFiles: Record<string, File> = {};

      for (let i = 0; i < filesToProcess.length; i++) {
        const item = filesToProcess[i];
        let file: File;

        if (item instanceof File) {
          file = item;
        } else {
          const ext = item.type.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
          file = new File([item], `${defaultPrefix}-${Date.now()}-${i + 1}.${ext}`, {
            type: item.type || 'image/png',
          });
        }

        // Automatically crop to 3:4 center
        const croppedBlob = await autoCropImageTo3x4(file);

        // Create a File from the Blob
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const fileName = `${baseName || defaultPrefix}.webp`;
        const croppedFile = new File([croppedBlob], fileName, { type: 'image/webp' });

        // Generate a local preview URL
        const localUrl = URL.createObjectURL(croppedFile);

        const newId = Math.random().toString(36).substring(7);
        newImages.push({ id: newId, url: localUrl, file: croppedFile, isNew: true });

        // Store original file so it can be re-cropped later
        newOriginalFiles[newId] = file;
      }

      setImages((prev) => [...prev, ...newImages].slice(0, 10));
      setOriginalFiles((prev) => ({ ...prev, ...newOriginalFiles }));

      if (files.length > availableSlots) {
        optionsRef.current?.onToast?.({
          message: `Added ${newImages.length} image(s). Maximum limit of 10 images reached.`,
          type: 'warning',
        });
      }

      return newImages.length;
    } catch (error) {
      console.error('Error auto-cropping images:', error);
      optionsRef.current?.onToast?.({
        message: 'Failed to process images. Please try again.',
        type: 'error',
      });
      return 0;
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const newFiles = Array.from(e.target.files ?? []);
    await processImageFiles(newFiles, 'upload');
  };

  const handlePasteFromClipboard = async () => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      optionsRef.current?.onToast?.({
        message: 'Clipboard API is not supported in this browser. Please use Ctrl+V.',
        type: 'warning',
      });
      return;
    }

    if (imagesRef.current.length >= 10) {
      optionsRef.current?.onToast?.({
        message: 'Maximum limit of 10 images reached.',
        type: 'warning',
      });
      return;
    }

    if (navigator.clipboard.read) {
      try {
        const clipboardItems = await navigator.clipboard.read();
        const imageBlobs: Blob[] = [];

        for (const item of clipboardItems) {
          const imageType = item.types.find((type) => type.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            imageBlobs.push(blob);
          }
        }

        if (imageBlobs.length > 0) {
          const count = await processImageFiles(imageBlobs, 'clipboard-image');
          if (count > 0) {
            optionsRef.current?.onToast?.({
              message: `${count} image${count > 1 ? 's' : ''} pasted from clipboard!`,
              type: 'success',
            });
          }
          return;
        }
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          optionsRef.current?.onToast?.({
            message: 'Clipboard permission denied. Please press Ctrl+V to paste directly.',
            type: 'warning',
          });
          return;
        }
        console.warn('navigator.clipboard.read failed, falling back:', err);
      }
    }

    optionsRef.current?.onToast?.({
      message:
        'No image found in clipboard. Copy an image (from WhatsApp, web, etc.) and try again.',
      type: 'warning',
    });
  };

  const handleExternalDrop = async (files: FileList | File[]) => {
    const fileArray = Array.from(files ?? []).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      optionsRef.current?.onToast?.({
        message: 'Please drop valid image files (PNG, JPG, WebP, etc.).',
        type: 'warning',
      });
      return;
    }
    const count = await processImageFiles(fileArray, 'dropped-image');
    if (count > 0) {
      optionsRef.current?.onToast?.({
        message: `${count} image${count > 1 ? 's' : ''} added successfully!`,
        type: 'success',
      });
    }
  };

  // Listen to window paste event so users can press Ctrl+V anywhere
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      const hasText = !!e.clipboardData?.getData('text/plain');

      // If user is actively typing in a text field and pasting text, do not intercept
      if (isInput && hasText) {
        return;
      }

      const imageFiles: File[] = [];

      // 1. Check e.clipboardData.files (e.g. copied from file explorer or screenshot)
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        for (const file of Array.from(e.clipboardData.files)) {
          if (file.type.startsWith('image/')) {
            imageFiles.push(file);
          }
        }
      }

      // 2. Check e.clipboardData.items (e.g. copied from WhatsApp, browser, snip tool)
      if (imageFiles.length === 0 && e.clipboardData?.items && e.clipboardData.items.length > 0) {
        for (const item of Array.from(e.clipboardData.items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              imageFiles.push(file);
            }
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        const count = await processImageFiles(imageFiles, 'pasted-image');
        if (count > 0) {
          optionsRef.current?.onToast?.({
            message: `${count} image${count > 1 ? 's' : ''} pasted from clipboard!`,
            type: 'success',
          });
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleReCrop = (imageId: string, croppedBlob: Blob, originalName: string) => {
    const croppedFile = new File([croppedBlob], originalName, { type: 'image/webp' });
    const localUrl = URL.createObjectURL(croppedFile);

    setImages((prev) => {
      const newImages = [...prev];
      const index = newImages.findIndex((img) => img.id === imageId);
      if (index !== -1) {
        newImages[index] = { id: imageId, url: localUrl, file: croppedFile, isNew: true };
      }
      return newImages;
    });
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

  const removeImage = (idToRemove: string) => {
    const imgToRemove = images.find((img) => img.id === idToRemove);
    if (imgToRemove) {
      setImagesToDelete((delPrev) => {
        if (delPrev.some((img) => img.id === idToRemove)) {
          return delPrev;
        }
        return [...delPrev, imgToRemove];
      });
    }
    setImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const restoreImage = (idToRestore: string) => {
    const imgToRestore = imagesToDelete.find((img) => img.id === idToRestore);
    if (imgToRestore) {
      setImages((imgPrev) => {
        if (imgPrev.some((img) => img.id === idToRestore)) {
          return imgPrev;
        }
        return [...imgPrev, imgToRestore];
      });
    }
    setImagesToDelete((prev) => prev.filter((img) => img.id !== idToRestore));
  };

  const filteredColors = useMemo(() => {
    if (!colorInput.trim()) {
      return apiColors;
    }
    return apiColors.filter(
      (c) =>
        c.name.toLowerCase().includes(colorInput.toLowerCase()) ||
        c.hex.toLowerCase().includes(colorInput.toLowerCase()),
    );
  }, [apiColors, colorInput]);
  const availableSizes = useMemo(() => {
    return getCategorySizes(category, gender);
  }, [category, gender]);

  const clearSizes = () => {
    setSizes([]);
  };

  const selectAllSizes = () => {
    setSizes([...availableSizes]);
  };

  const [availableCollections, setAvailableCollections] = useState<string[]>([
    'Summer Drop',
    'Y2K Style',
    'Streetwear Essentials',
    'Luxury Elite',
    'Performance Active',
    'Bags & Utility',
  ]);

  useEffect(() => {
    async function loadCollections() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/collections`,
        );
        const data = (await res.json()) as { name: string }[];
        if (Array.isArray(data) && data.length > 0) {
          const names = data.map((c) => c.name);
          setAvailableCollections((prev) => Array.from(new Set([...names, ...prev])));
        }
      } catch (err) {
        console.error('Failed to load collections in add product form', err);
      }
    }
    void loadCollections();
  }, []);

  const toggleCollection = (colName: string) => {
    setTags((prev) =>
      prev.includes(colName) ? prev.filter((t) => t !== colName) : [...prev, colName],
    );
  };

  const filteredBrands = useMemo(() => {
    const seen = new Set<string>();
    return apiBrands.filter((b) => {
      if (!b?.name) {
        return false;
      }
      const lowerName = b.name.toLowerCase();
      if (brandInput && !lowerName.includes(brandInput.toLowerCase())) {
        return false;
      }
      if (seen.has(lowerName)) {
        return false;
      }
      seen.add(lowerName);
      return true;
    });
  }, [apiBrands, brandInput]);

  // Progress tracking
  const getProgress = () => {
    const fields = [
      productName,
      productDesc,
      brandInput,
      selectedColors.length > 0 ? 'filled' : colorInput,
      basePrice,
      stock,
      images.length > 0 ? 'filled' : '',
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
    setSizes,
    toggleSize,
    clearSizes,
    selectAllSizes,
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
    selectedColors,
    setSelectedColors,
    toggleColor,
    removeColor,
    isColorOpen,
    setIsColorOpen,
    isAddColorModalOpen,
    newColorDefaultName,
    newColorDefaultHex,
    isSavingNewColor,
    openAddColorModal,
    closeAddColorModal,
    handleCreateAndSelectColor,
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
    setImages,
    draggedIndex,
    categoryRef,
    qualityRef,
    colorRef,
    brandRef,
    handleImageUpload,
    handlePasteFromClipboard,
    handleExternalDrop,
    processImageFiles,
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
    originalFiles,
    handleReCrop,
    apiCategories,
    availableCollections,
    toggleCollection,
    selectedCategoryId,
    setSelectedCategoryId,
    liveWatching,
    setLiveWatching,
    liveSold,
    setLiveSold,
    averageRating,
    setAverageRating,
    totalReviews,
    setTotalReviews,
  };
}
