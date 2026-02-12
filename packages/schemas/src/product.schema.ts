import { z } from 'zod';

export const ProductStatus = z.enum(["Pending", "Draft", "Published", "Rejected", "Archived"]);
export const ProductCategory = z.enum(["Watches", "Sneakers", "Clothing", "Accessories"]);

export const GenderEnum = z.enum(['men', 'women', 'unisex']);
export const QualityEnum = z.enum(['UA', 'Semi UA', '10A', '7A', '7AA', 'Standard', 'Premium', 'Luxury']);


export const SellerSchema = z.object({
    sellerId: z.string(),
    name: z.string(),
    gettingPrice: z.number(), // Your cost from dealer
    stock: z.number().int().nonnegative(),
    isVerified: z.boolean(),
});


// --- Main Product Schema ---
export const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    slug: z.string(), // e.g., "nike-air-force-1-blue"
    description: z.string(),
    brand: z.array(z.string()), // Handles collabs like ["Nike", "Stussy"]
    status: ProductStatus,
    category: ProductCategory,
    gender: GenderEnum,
    


    // Pricing
    price: z.object({
        ogPrice: z.number(),      // Original Retail Price
        sellingPrice: z.number(), // Current customer price
        gettingPrice: z.number(), // Dealer price (for profit calc)
    }),

    // Media & Gallery
    media: z.object({
        mainImage: z.string().url(),
        promoImage: z.string().url().optional(),
        liveImages: z.array(z.string().url()),
        youtubeId: z.string().optional(),
    }),

    // Product Specifics & Attributes
    attributes: z.object({
        colors: z.array(z.string()), // Multiple color support
        quality: z.string(),
        sizes: z.array(z.string()),
        materials: z.array(z.string()).optional(),
        specs: z.record(z.string(), z.string()).optional(), // Fixed Zod Record
    }),

    // Multi-Vendor & Inventory
    inventory: z.object({
        sellers: z.array(SellerSchema),
        totalStock: z.number().int(),
        sku: z.string().optional(),
    }),

    // Social Proof (Obfuscated for Frontend)
    liveMatrix: z.object({
        liveWatching: z.number().int(), 
        liveSold: z.number().int(), 
    }),

    // Marketing & Growth
    marketing: z.object({
        collections: z.array(z.string()), // ["Summer Special", "Winter 2026"]
        isFeatured: z.boolean().default(false),
        seoTitle: z.string().max(70).optional(),
        seoDescription: z.string().optional(),
    }),

    rating: z.object({
        averageRating: z.number().default(4),
        totalReviews: z.number().int().default(0),
    }),

    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;