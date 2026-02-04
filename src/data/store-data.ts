import { z } from "zod";

// --- 1. SCHEMAS & TYPES ---

export const CategoryEnum = z.enum(['sneakers', 'watches', 'cloths', 'slippers', 'accessories']);
export const GenderEnum = z.enum(['men', 'women', 'unisex']);
export const QualityEnum = z.enum(['UA', 'Semi UA', '10A', '7A', '6A', '5A', '7AA', 'Standard']);

export const ReviewSchema = z.object({
    userName: z.string(),
    userImage: z.string(),
    rating: z.number(),
    comment: z.string(),
    date: z.string(),
});

export const AttributeSchema = z.object({
    key: z.string(),
    value: z.string(),
});

export const VariantSchema = z.object({
    id: z.string(),
    color: z.string(),
    quality: QualityEnum,
    price: z.number(),
    ogPrice: z.number(),
    stock: z.number(),
    images: z.array(z.string()),
    sizes: z.array(z.string()).optional(),
});

export const ProductSchema = z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    brand: z.string(),
    category: CategoryEnum,
    gender: GenderEnum,
    description: z.string(),
    promoImage: z.string(),
    videoUrl: z.string(),
    staticNumber: z.number(),
    popularityScore: z.number(),
    salesCount: z.number(),
    discount: z.number(),
    reviews: z.array(ReviewSchema),
    variants: z.array(VariantSchema),
    attributes: z.array(AttributeSchema).optional(),
    defaultPrice: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type CategorySlug = z.infer<typeof CategoryEnum>;

// --- 2. COMPLETE PRODUCT LIST (ALL PRODUCTS PRESERVED) ---

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 's1',
        slug: 'kobe-iii-protro-white',
        name: 'Kobe III Protro',
        brand: 'Nike',
        category: 'sneakers',
        gender: 'unisex',
        description: 'The Kobe III Protro scales back the weight while maintaining the iconic silhouette.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fbeaf128-4abc-44ff-8fae-08a6dd8b1852/KOBE+III+PROTRO.png',
        videoUrl: 'nsWzL9PFB8k',
        staticNumber: 3,
        popularityScore: 95,
        salesCount: 120,
        discount: 10,
        defaultPrice: 2499,
        reviews: [{ userName: "Arjun S.", userImage: "https://i.pravatar.cc/150?u=1", rating: 5, comment: "Insane quality.", date: "2 days ago" }],
        attributes: [{ key: "Cushioning", value: "Zoom Air" }],
        variants: [{
            id: 'v1-s1', color: 'White', quality: 'UA', price: 2499, ogPrice: 9999, stock: 15, sizes: ['EU 42', 'EU 43'],
            images: [
                'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTyPiwCw81Am4QRb1ErRMSIok8zWovJPXd6H7HtCZCvmCXutALe4Y4SOKA9izLJ4EcFWkQ7Raw5lXWlMISpQNT5PGLhK_qLgyyj3BXT406EjOC-6h4TwlPFXAQ',
                'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQOMtpWEr9ToxBB8gyiEr9IH3oI5dSFVgmY7TNdiuYxc-kO7-78-5ku3NqP67XHudhGF47w41Lx3WX4sXQQdJpjg7SLned6FZObzxYiMiZLQ4ICJLaPsyytcQ'
            ]
        }]
    },
    {
        id: 's2',
        slug: 'sb-dunk-low-pro-black',
        name: 'SB Dunk Low Pro',
        brand: 'Nike',
        category: 'sneakers',
        gender: 'men',
        description: 'Classic skating silhouette in a stealthy black finish.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png',
        videoUrl: 'qi7IM5UshIo',
        staticNumber: 2,
        popularityScore: 88,
        salesCount: 200,
        discount: 5,
        defaultPrice: 9200,
        reviews: [],
        variants: [{ id: 'v1-s2', color: 'Black', quality: 'Semi UA', price: 9200, ogPrice: 9999, stock: 8, sizes: ['EU 44'], images: ['https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=800'] }]
    },
    {
        id: 's3',
        slug: 'air-jordan-1-low-qs-red',
        name: 'Air Jordan 1 Low',
        brand: 'Jordan',
        category: 'sneakers',
        gender: 'men',
        description: 'The classic AJ1 silhouette in a low-cut profile.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2be76228-ff51-4c87-b120-e7be37db4d2e/AIR+FORCE+1+LOW+QS.png',
        videoUrl: 'dQw4w9WgXcQ',
        staticNumber: 4,
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        defaultPrice: 9999,
        reviews: [],
        variants: [{ id: 'v1-s3', color: 'Red', quality: 'UA', price: 9999, ogPrice: 9999, stock: 0, images: [] }]
    },
    {
        id: 's4', slug: 'zoom-gp-challenge-prm', name: 'Zoom GP Challenge 1.5', brand: 'Jordan', category: 'sneakers', gender: 'men',
        description: 'Premium sports performance.', promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85f69d4c-7a54-4e31-be57-d8896a73f341/W+ZOOM+GP+CHALLENGE+1.5+HC+PRM.png',
        videoUrl: 'dQw4w9WgXcQ', staticNumber: 3, popularityScore: 99, salesCount: 350, discount: 25, defaultPrice: 9999, reviews: [],
        variants: [{ id: 'v1-s4', color: 'Red', quality: 'UA', price: 9999, ogPrice: 9999, stock: 10, images: [] }]
    },
    {
        id: 's5', slug: 'zoom-gp-challenge-pro', name: 'Zoom GP Challenge Pro', brand: 'Jordan', category: 'sneakers', gender: 'men',
        description: 'Pro level court control.', promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
        videoUrl: 'dQw4w9WgXcQ', staticNumber: 2, popularityScore: 99, salesCount: 350, discount: 25, defaultPrice: 9999, reviews: [],
        variants: [{ id: 'v1-s5', color: 'Red', quality: 'UA', price: 9999, ogPrice: 9999, stock: 10, images: [] }]
    },
    {
        id: 's6', slug: 'air-force-1-mini-jewel', name: 'AF1 Mini Jewel', brand: 'Jordan', category: 'sneakers', gender: 'men',
        description: 'Elegant mini jewel detailing.', promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fcbdc68-279b-4e41-bd31-ea3879164798/W+AIR+FORCE+1+%2707+MINI+JEWEL.png',
        videoUrl: 'dQw4w9WgXcQ', staticNumber: 5, popularityScore: 99, salesCount: 350, discount: 25, defaultPrice: 9999, reviews: [],
        variants: [{ id: 'v1-s6', color: 'Red', quality: 'UA', price: 9999, ogPrice: 9999, stock: 10, images: [] }]
    },
    {
        id: 's7', slug: 'air-force-1-07-classic', name: 'Air Force 1 \'07', brand: 'Jordan', category: 'sneakers', gender: 'men',
        description: 'The original 1982 classic.', promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fc4622c4-2769-4665-aa6e-42c974a7705e/AIR+FORCE+1+%2707.png',
        videoUrl: 'dQw4w9WgXcQ', staticNumber: 7, popularityScore: 99, salesCount: 350, discount: 25, defaultPrice: 9999, reviews: [],
        variants: [{ id: 'v1-s7', color: 'Red', quality: 'UA', price: 9999, ogPrice: 9999, stock: 10, images: [] }]
    },
    {
        id: 's8', slug: 'air-force-1-07-prm', name: 'Air Force 1 \'07 PRM', brand: 'Jordan', category: 'sneakers', gender: 'men',
        description: 'Premium material construction.', promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/d217b510-81ac-429c-9881-8103c306e210/W+AIR+FORCE+1+%2707+PRM.png',
        videoUrl: 'dQw4w9WgXcQ', staticNumber: 4, popularityScore: 99, salesCount: 350, discount: 25, defaultPrice: 9999, reviews: [],
        variants: [{ id: 'v1-s8', color: 'Red', quality: 'UA', price: 9999, ogPrice: 9999, stock: 10, images: [] }]
    },
    {
        id: 'w1', slug: 'automatic-diver-silver', name: 'Automatic Diver', brand: 'Seiko', category: 'watches', gender: 'men',
        description: '7AA Grade automatic movement.', promoImage: 'https://www.swisstimehouse.com/199560-home_default/titan-90217sl02.jpg',
        videoUrl: 'M7lc1UVf-VE', staticNumber: 3, popularityScore: 75, salesCount: 45, discount: 15, defaultPrice: 9500, reviews: [],
        attributes: [{ key: "Movement", value: "Automatic" }],
        variants: [{ id: 'v1-w1', color: 'Silver', quality: '7AA', price: 9500, ogPrice: 9999, stock: 5, images: [] }]
    },
    {
        id: 'w2', slug: 'g-shock-carbon-black', name: 'G-Shock Carbon', brand: 'Casio', category: 'watches', gender: 'unisex',
        description: 'Indestructible G-Shock technology.', promoImage: "https://www.swisstimehouse.com/199552-home_default/titan-90217ql01.jpg",
        videoUrl: 'dQw4w9WgXcQ', staticNumber: 5, popularityScore: 92, salesCount: 150, discount: 0, defaultPrice: 6800, reviews: [],
        attributes: [{ key: "Material", value: "Resin" }],
        variants: [{ id: 'v1-w2', color: 'Black', quality: '10A', price: 6800, ogPrice: 9999, stock: 20, images: [] }]
    },
    {
        id: 'c1', slug: 'zara-oversized-cotton-tee', name: 'Oversized Cotton Tee', brand: 'Zara', category: 'cloths', gender: 'unisex',
        description: 'Premium heavyweight cotton tee.', promoImage: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20240313/pglM/65f0d70f05ac7d77bbaf22ed/-473Wx593H-467162483-multi-MODEL.jpg',
        videoUrl: 'dQw4w9WgXcQ', staticNumber: 7, popularityScore: 80, salesCount: 500, discount: 20, defaultPrice: 1200, reviews: [],
        attributes: [{ key: "GSM", value: "240" }, { key: "Fabric", value: "Cotton" }],
        variants: [{ id: 'v1-c1', color: 'White', quality: 'Standard', price: 1200, ogPrice: 9999, stock: 50, images: [] }]
    }
];

// --- 3. UNIFIED FILTER ENGINE ---

export function filterProducts(products: Product[], activeFilters: Record<string, string[]>) {
    return products.filter((product) => {
        for (const [key, selectedOptions] of Object.entries(activeFilters)) {
            if (!selectedOptions || selectedOptions.length === 0) continue;

            // Price Range Logic
            if (key === 'priceRange') {
                const [min, max] = selectedOptions[0].split('-').map(Number);
                if (product.defaultPrice < min || product.defaultPrice > max) return false;
                continue;
            }

            // Root Level Check
            const rootValue = (product as any)[key]?.toString().toLowerCase();
            if (rootValue && selectedOptions.some(opt => opt.toLowerCase() === rootValue)) continue;

            // Attribute Level Check (GSM, Fabric, etc.)
            const attrMatch = product.attributes?.some(attr =>
                attr.key.toLowerCase() === key.toLowerCase() &&
                selectedOptions.map(o => o.toLowerCase()).includes(attr.value.toLowerCase())
            );
            if (attrMatch) continue;

            // Variant Level Check (Color, Quality, Size)
            const variantMatch = product.variants.some((v) => {
                if (key === 'color') return selectedOptions.some(opt => opt.toLowerCase() === v.color.toLowerCase());
                if (key === 'quality') return selectedOptions.includes(v.quality);
                if (key === 'size') return v.sizes?.some(s => selectedOptions.includes(s));
                return false;
            });

            if (!variantMatch) return false;
        }
        return true;
    });
}



export const CATEGORY_FILTERS: Record<string, { id: string; label: string; options: string[] }[]> = {
  sneakers: [
    { id: 'brand', label: 'Brand', options: ["Nike", "Adidas", "Jordan", "Puma", "Yeezy"] },
    { id: 'quality', label: 'Quality Grade', options: ['UA', 'Semi UA', '7A', 'Standard'] },
    { id: 'color', label: 'Color', options: ['Black', 'White', 'Red', 'Blue', 'Grey'] },
    { id: 'size', label: 'Size', options: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'] },
  ],
  watches: [
    { id: 'brand', label: 'Brand', options: ["Seiko", "Casio", "Rolex", "G-Shock"] },
    { id: 'quality', label: 'Quality Grade', options: ['7AA', '10A', '5A'] },
    { id: 'Material', label: 'Material', options: ['Steel', 'Resin', 'Leather'] },
  ],
  cloths: [
    { id: 'brand', label: 'Brand', options: ["Zara", "H&M", "Louis Vuitton"] },
    { id: 'quality', label: 'Quality Grade', options: ['Master Copy', 'Standard'] },
    { id: 'GSM', label: 'GSM', options: ['180', '200', '240'] },
  ],
  // Add slippers and accessories as needed
};