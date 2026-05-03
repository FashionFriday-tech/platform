import { useState, useRef, useEffect } from "react";
import { BRAND_LOGOS, MAJOR_COLORS, type BrandCategory, type Product } from "@ff/schemas";
import { SIZE_MAP } from "../utils/constants";

export function useAddProductForm(initialData?: Product) {
  const [sizes, setSizes] = useState<string[]>(["S"]);
  const [gender, setGender] = useState<string>("Woman");
  const [category, setCategory] = useState<string>("Jacket");
  const [quality, setQuality] = useState<string>("Original");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [brandInput, setBrandInput] = useState("");
  const [selectedBrandLogo, setSelectedBrandLogo] = useState<string | null>(null);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const [colorInput, setColorInput] = useState("");
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(null);
  const [isColorOpen, setIsColorOpen] = useState(false);

  const [videoLink, setVideoLink] = useState("");
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isQualityOpen, setIsQualityOpen] = useState(false);

  // Form Fields
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [ogPrice, setOgPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  
  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoSlug, setSeoSlug] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoError, setSeoError] = useState("");

  // Media
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<{id: string, url: string}[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const categoryRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  // Prepopulate data if editing
  useEffect(() => {
    if (initialData) {
      setProductName(initialData.name || "");
      setProductDesc(initialData.description || "");
      setCategory(initialData.category || "Jacket");
      setQuality(initialData.attributes?.quality || "Original");
      setBrandInput(initialData.brand?.[0] || "");
      setBasePrice(initialData.price?.sellingPrice?.toString() || "");
      setOgPrice(initialData.price?.ogPrice?.toString() || "");
      setStock(initialData.inventory?.totalStock?.toString() || "");
      setSku(initialData.inventory?.sku || "");
      setSizes(initialData.attributes?.sizes || ["S"]);
      setTags(initialData.marketing?.collections || []);
      setSeoTitle(initialData.marketing?.seoTitle || "");
      setSeoDesc(initialData.marketing?.seoDescription || "");
      setSeoSlug(initialData.slug || "");
      
      if (initialData.media?.liveImages && initialData.media.liveImages.length > 0) {
        setImages(initialData.media.liveImages.map((url, i) => ({ id: `init-${i}`, url })));
      } else if (initialData.media?.mainImage) {
        setImages([{ id: "init-main", url: initialData.media.mainImage }]);
      }
    }
  }, [initialData]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) setIsCategoryOpen(false);
      if (qualityRef.current && !qualityRef.current.contains(event.target as Node)) setIsQualityOpen(false);
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) setIsColorOpen(false);
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) setIsBrandOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    if (videoLink.match(shortsRegex)) id = videoLink.match(shortsRegex)![1];
    else if (videoLink.match(watchRegex)) id = videoLink.match(watchRegex)![1];
    else if (videoLink.match(youtuBeRegex)) id = videoLink.match(youtuBeRegex)![1];
    
    if (id) {
      setVideoId(id);
      setEmbedUrl(`https://www.youtube.com/embed/${id}?controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&autoplay=1`);
    } else {
      setVideoId(null);
      setEmbedUrl(null);
    }
  }, [videoLink]);

  const handleCategorySelect = (c: string) => {
    setCategory(c);
    setIsCategoryOpen(false);
    setSizes([]);
    setBrandInput(""); // Reset brand when category changes
    setSelectedBrandLogo(null);
  };

  const toggleSize = (s: string) => {
    setSizes(prev => 
      prev.includes(s) ? prev.filter(sz => sz !== s) : [...prev, s]
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const generateSEO = () => {
    if (!productName.trim() || !productDesc.trim()) {
      setSeoError("Info not available.");
      return;
    }
    setSeoError("");
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSeoSlug(slug);
    setSeoTitle(`Buy ${productName} - Fashion Friday`);
    setSeoDesc(`Shop the latest ${productName}. ${productDesc.substring(0, 50)}... Fast shipping, great deals, and premium materials. Buy now at Fashion Friday.`);
    
    // Auto-generate tags based on general info
    const newTags = new Set([...tags, category.toLowerCase(), quality.toLowerCase(), "fashion", "trendy"]);
    if (colorInput.trim()) newTags.add(colorInput.toLowerCase().trim());
    if (brandInput.trim()) newTags.add(brandInput.toLowerCase().trim());
    setTags(Array.from(newTags));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImages = newFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file)
      }));
      
      setImages(prev => {
        const combined = [...prev, ...newImages];
        return combined.slice(0, 10);
      });
      // reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
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
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === toIndex) return;

    setImages(prev => {
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
    setImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  const filteredColors = MAJOR_COLORS.filter(c => c.name.toLowerCase().includes(colorInput.toLowerCase()));
  const availableSizes = SIZE_MAP[category] || SIZE_MAP["Jacket"];
  
  const categoryToBrandCategory: Record<string, BrandCategory[]> = {
    "Jacket": ["fashion", "streetwear", "sportswear", "luxury"],
    "Shirts": ["fashion", "streetwear", "luxury"],
    "Sneakers": ["sneakers", "sportswear", "footwear", "luxury"],
    "Pants": ["fashion", "streetwear", "luxury"]
  };
  const availableBrands = BRAND_LOGOS.filter(b => b.categories.some(c => categoryToBrandCategory[category]?.includes(c)));
  const filteredBrands = availableBrands.filter(b => b.name.toLowerCase().includes(brandInput.toLowerCase()));

  // Progress tracking
  const getProgress = () => {
    const fields = [
      productName, productDesc, brandInput, colorInput,
      basePrice, ogPrice, stock, sku,
      images.length > 0 ? "filled" : "",
      videoLink, tags.length > 0 ? "filled" : "",
      seoSlug, seoTitle, seoDesc
    ];
    const filled = fields.filter(f => typeof f === 'string' ? f.trim() !== "" : f !== "").length;
    return { filled, total: fields.length };
  };

  const progress = getProgress();

  return {
    sizes, toggleSize,
    gender, setGender,
    category, setCategory, handleCategorySelect,
    quality, setQuality,
    tags, setTags, tagInput, setTagInput, handleTagKeyDown, removeTag,
    brandInput, setBrandInput, selectedBrandLogo, setSelectedBrandLogo, isBrandOpen, setIsBrandOpen,
    colorInput, setColorInput, selectedColorHex, setSelectedColorHex, isColorOpen, setIsColorOpen,
    videoLink, setVideoLink, embedUrl, videoId,
    isCategoryOpen, setIsCategoryOpen,
    isQualityOpen, setIsQualityOpen,
    productName, setProductName,
    productDesc, setProductDesc,
    basePrice, setBasePrice,
    ogPrice, setOgPrice,
    stock, setStock,
    sku, setSku,
    seoTitle, setSeoTitle,
    seoSlug, setSeoSlug,
    seoDesc, setSeoDesc,
    seoError, generateSEO,
    fileInputRef, images, draggedIndex,
    categoryRef, qualityRef, colorRef, brandRef,
    handleImageUpload, handleReorder, handleDragStart, handleDragOver, handleDrop, handleDragEnd, removeImage,
    filteredColors, availableSizes, filteredBrands,
    progress
  };
}
