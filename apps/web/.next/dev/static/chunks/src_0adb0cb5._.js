(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/data/store-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttributeSchema",
    ()=>AttributeSchema,
    "CATEGORY_FILTERS",
    ()=>CATEGORY_FILTERS,
    "CategoryEnum",
    ()=>CategoryEnum,
    "GenderEnum",
    ()=>GenderEnum,
    "MOCK_PRODUCTS",
    ()=>MOCK_PRODUCTS,
    "ProductSchema",
    ()=>ProductSchema,
    "QualityEnum",
    ()=>QualityEnum,
    "ReviewSchema",
    ()=>ReviewSchema,
    "VariantSchema",
    ()=>VariantSchema,
    "filterProducts",
    ()=>filterProducts,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getSimilarProducts",
    ()=>getSimilarProducts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const CategoryEnum = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'sneakers',
    'watches',
    'cloths',
    'slippers',
    'accessories'
]);
const GenderEnum = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'men',
    'women',
    'unisex'
]);
const QualityEnum = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'UA',
    'Semi UA',
    '10A',
    '7A',
    '6A',
    '5A',
    '7AA',
    'Standard'
]);
const ReviewSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    userName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    userImage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    rating: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    comment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const AttributeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const VariantSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    quality: QualityEnum,
    price: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    ogPrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    stock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    images: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    sizes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const ProductSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    brand: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    category: CategoryEnum,
    gender: GenderEnum,
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    promoImage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    videoUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    quality: QualityEnum,
    staticNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    popularityScore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    salesCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    discount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    reviews: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(ReviewSchema),
    variants: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(VariantSchema),
    attributes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(AttributeSchema).optional(),
    defaultPrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$3$2e$6$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const MOCK_PRODUCTS = [
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
        quality: "UA",
        staticNumber: 3,
        popularityScore: 95,
        salesCount: 120,
        discount: 10,
        defaultPrice: 2499,
        reviews: [
            {
                userName: "Arjun S.",
                userImage: "https://i.pravatar.cc/150?u=1",
                rating: 5,
                comment: "Insane quality.",
                date: "2 days ago"
            }
        ],
        attributes: [
            {
                key: "Cushioning",
                value: "Zoom Air"
            }
        ],
        variants: [
            {
                id: 'v1-s1',
                color: 'White',
                quality: 'UA',
                price: 2499,
                ogPrice: 9999,
                stock: 15,
                sizes: [
                    '36',
                    '37',
                    '38',
                    '39'
                ],
                images: [
                    'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTyPiwCw81Am4QRb1ErRMSIok8zWovJPXd6H7HtCZCvmCXutALe4Y4SOKA9izLJ4EcFWkQ7Raw5lXWlMISpQNT5PGLhK_qLgyyj3BXT406EjOC-6h4TwlPFXAQ',
                    'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQOMtpWEr9ToxBB8gyiEr9IH3oI5dSFVgmY7TNdiuYxc-kO7-78-5ku3NqP67XHudhGF47w41Lx3WX4sXQQdJpjg7SLned6FZObzxYiMiZLQ4ICJLaPsyytcQ'
                ]
            }
        ]
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
        quality: "10A",
        staticNumber: 2,
        popularityScore: 88,
        salesCount: 200,
        discount: 5,
        defaultPrice: 9200,
        reviews: [],
        variants: [
            {
                id: 'v1-s2',
                color: 'Black',
                quality: 'Semi UA',
                price: 9200,
                ogPrice: 9999,
                stock: 8,
                sizes: [
                    '44'
                ],
                images: [
                    'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=800'
                ]
            }
        ]
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
        quality: "7A",
        staticNumber: 4,
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        defaultPrice: 9999,
        reviews: [],
        variants: [
            {
                id: 'v1-s3',
                color: 'Red',
                quality: 'UA',
                price: 9999,
                ogPrice: 9999,
                stock: 0,
                images: []
            }
        ]
    },
    {
        id: 's4',
        slug: 'zoom-gp-challenge-prm',
        name: 'Zoom GP Challenge 1.5',
        brand: 'Jordan',
        category: 'sneakers',
        gender: 'men',
        description: 'Premium sports performance.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85f69d4c-7a54-4e31-be57-d8896a73f341/W+ZOOM+GP+CHALLENGE+1.5+HC+PRM.png',
        videoUrl: 'dQw4w9WgXcQ',
        quality: "UA",
        staticNumber: 3,
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        defaultPrice: 9999,
        reviews: [],
        variants: [
            {
                id: 'v1-s4',
                color: 'Red',
                quality: 'UA',
                price: 9999,
                ogPrice: 9999,
                stock: 10,
                images: []
            }
        ]
    },
    {
        id: 's5',
        slug: 'zoom-gp-challenge-pro',
        name: 'Zoom GP Challenge Pro',
        brand: 'Jordan',
        category: 'sneakers',
        gender: 'men',
        description: 'Pro level court control.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
        videoUrl: 'dQw4w9WgXcQ',
        quality: "UA",
        staticNumber: 2,
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        defaultPrice: 9999,
        reviews: [],
        variants: [
            {
                id: 'v1-s5',
                color: 'Red',
                quality: 'UA',
                price: 9999,
                ogPrice: 9999,
                stock: 10,
                images: []
            }
        ]
    },
    {
        id: 's6',
        slug: 'air-force-1-mini-jewel',
        name: 'AF1 Mini Jewel',
        brand: 'Jordan',
        category: 'sneakers',
        gender: 'men',
        description: 'Elegant mini jewel detailing.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fcbdc68-279b-4e41-bd31-ea3879164798/W+AIR+FORCE+1+%2707+MINI+JEWEL.png',
        videoUrl: 'dQw4w9WgXcQ',
        quality: "UA",
        staticNumber: 5,
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        defaultPrice: 9999,
        reviews: [],
        variants: [
            {
                id: 'v1-s6',
                color: 'Red',
                quality: 'UA',
                price: 9999,
                ogPrice: 9999,
                stock: 10,
                images: []
            }
        ]
    },
    {
        id: 's7',
        slug: 'air-force-1-07-classic',
        name: 'Air Force 1 \'07',
        brand: 'Jordan',
        category: 'sneakers',
        gender: 'men',
        description: 'The original 1982 classic.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fc4622c4-2769-4665-aa6e-42c974a7705e/AIR+FORCE+1+%2707.png',
        videoUrl: 'dQw4w9WgXcQ',
        quality: "UA",
        staticNumber: 7,
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        defaultPrice: 9999,
        reviews: [],
        variants: [
            {
                id: 'v1-s7',
                color: 'Red',
                quality: 'UA',
                price: 9999,
                ogPrice: 9999,
                stock: 10,
                images: []
            }
        ]
    },
    {
        id: 's8',
        slug: 'air-force-1-07-prm',
        name: 'Air Force 1 \'07 PRM',
        brand: 'Jordan',
        category: 'sneakers',
        gender: 'men',
        description: 'Premium material construction.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/d217b510-81ac-429c-9881-8103c306e210/W+AIR+FORCE+1+%2707+PRM.png',
        videoUrl: 'dQw4w9WgXcQ',
        quality: "UA",
        staticNumber: 4,
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        defaultPrice: 9999,
        reviews: [],
        variants: [
            {
                id: 'v1-s8',
                color: 'Red',
                quality: 'UA',
                price: 9999,
                ogPrice: 9999,
                stock: 10,
                images: []
            }
        ]
    },
    {
        id: 'w1',
        slug: 'automatic-diver-silver',
        name: 'Automatic Diver',
        brand: 'Seiko',
        category: 'watches',
        gender: 'men',
        description: '7AA Grade automatic movement.',
        promoImage: 'https://www.swisstimehouse.com/199560-home_default/titan-90217sl02.jpg',
        videoUrl: 'M7lc1UVf-VE',
        quality: "7A",
        staticNumber: 3,
        popularityScore: 75,
        salesCount: 45,
        discount: 15,
        defaultPrice: 9500,
        reviews: [],
        attributes: [
            {
                key: "Movement",
                value: "Automatic"
            }
        ],
        variants: [
            {
                id: 'v1-w1',
                color: 'Silver',
                quality: '7AA',
                price: 9500,
                ogPrice: 9999,
                stock: 5,
                images: []
            }
        ]
    },
    {
        id: 'w2',
        slug: 'g-shock-carbon-black',
        name: 'G-Shock Carbon',
        brand: 'Casio',
        category: 'watches',
        gender: 'unisex',
        description: 'Indestructible G-Shock technology.',
        promoImage: "https://www.swisstimehouse.com/199552-home_default/titan-90217ql01.jpg",
        videoUrl: 'dQw4w9WgXcQ',
        quality: "5A",
        staticNumber: 5,
        popularityScore: 92,
        salesCount: 150,
        discount: 0,
        defaultPrice: 6800,
        reviews: [],
        attributes: [
            {
                key: "Material",
                value: "Resin"
            }
        ],
        variants: [
            {
                id: 'v1-w2',
                color: 'Black',
                quality: '10A',
                price: 6800,
                ogPrice: 9999,
                stock: 20,
                images: []
            }
        ]
    },
    {
        id: 'c1',
        slug: 'zara-oversized-cotton-tee',
        name: 'Oversized Cotton Tee',
        brand: 'Zara',
        category: 'cloths',
        gender: 'unisex',
        description: 'Premium heavyweight cotton tee.',
        promoImage: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20240313/pglM/65f0d70f05ac7d77bbaf22ed/-473Wx593H-467162483-multi-MODEL.jpg',
        videoUrl: 'dQw4w9WgXcQ',
        quality: "Semi UA",
        staticNumber: 7,
        popularityScore: 80,
        salesCount: 500,
        discount: 20,
        defaultPrice: 1200,
        reviews: [],
        attributes: [
            {
                key: "GSM",
                value: "240"
            },
            {
                key: "Fabric",
                value: "Cotton"
            }
        ],
        variants: [
            {
                id: 'v1-c1',
                color: 'White',
                quality: 'Standard',
                price: 1200,
                ogPrice: 9999,
                stock: 50,
                images: []
            }
        ]
    }
];
function filterProducts(products, activeFilters) {
    return products.filter((product)=>{
        for (const [key, selectedOptions] of Object.entries(activeFilters)){
            if (!selectedOptions || selectedOptions.length === 0) continue;
            // Price Range Logic
            if (key === 'priceRange') {
                const [min, max] = selectedOptions[0].split('-').map(Number);
                if (product.defaultPrice < min || product.defaultPrice > max) return false;
                continue;
            }
            // Root Level Check
            const rootValue = product[key]?.toString().toLowerCase();
            if (rootValue && selectedOptions.some((opt)=>opt.toLowerCase() === rootValue)) continue;
            // Attribute Level Check (GSM, Fabric, etc.)
            const attrMatch = product.attributes?.some((attr)=>attr.key.toLowerCase() === key.toLowerCase() && selectedOptions.map((o)=>o.toLowerCase()).includes(attr.value.toLowerCase()));
            if (attrMatch) continue;
            // Variant Level Check (Color, Quality, Size)
            const variantMatch = product.variants.some((v)=>{
                if (key === 'color') return selectedOptions.some((opt)=>opt.toLowerCase() === v.color.toLowerCase());
                if (key === 'quality') return selectedOptions.includes(v.quality);
                if (key === 'size') return v.sizes?.some((s)=>selectedOptions.includes(s));
                return false;
            });
            if (!variantMatch) return false;
        }
        return true;
    });
}
const CATEGORY_FILTERS = {
    sneakers: [
        {
            id: 'brand',
            label: 'Brand',
            options: [
                "Nike",
                "Adidas",
                "Jordan",
                "Puma",
                "Yeezy"
            ]
        },
        {
            id: 'quality',
            label: 'Quality Grade',
            options: [
                'UA',
                'Semi UA',
                '7A',
                'Standard'
            ]
        },
        {
            id: 'color',
            label: 'Color',
            options: [
                'Black',
                'White',
                'Red',
                'Blue',
                'Grey'
            ]
        },
        {
            id: 'size',
            label: 'Size',
            options: [
                '40',
                '41',
                '42',
                '43',
                '44'
            ]
        }
    ],
    watches: [
        {
            id: 'brand',
            label: 'Brand',
            options: [
                "Seiko",
                "Casio",
                "Rolex",
                "G-Shock"
            ]
        },
        {
            id: 'quality',
            label: 'Quality Grade',
            options: [
                '7AA',
                '10A',
                '5A'
            ]
        },
        {
            id: 'Material',
            label: 'Material',
            options: [
                'Steel',
                'Resin',
                'Leather'
            ]
        }
    ],
    cloths: [
        {
            id: 'brand',
            label: 'Brand',
            options: [
                "Zara",
                "H&M",
                "Louis Vuitton"
            ]
        },
        {
            id: 'quality',
            label: 'Quality Grade',
            options: [
                'Master Copy',
                'Standard'
            ]
        },
        {
            id: 'GSM',
            label: 'GSM',
            options: [
                '180',
                '200',
                '240'
            ]
        }
    ]
};
async function getProductBySlug(slug) {
    // Simulating network delay for future-proofing
    return MOCK_PRODUCTS.find((p)=>p.slug === slug);
}
async function getSimilarProducts(category) {
    // Returns products in the same category, limiting to 4 for the UI
    return MOCK_PRODUCTS.filter((p)=>p.category === category).slice(0, 4);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/catalogue/hooks/use-catalogue.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCatalogue",
    ()=>useCatalogue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/store-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SettingsContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
const useCatalogue = ({ initialProducts, initialFilters = {} })=>{
    _s();
    const [activeFilters, setActiveFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFilters);
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("newest");
    // --- AUTO-SCROLL ENGINE ---
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const [isAutoScrolling, setIsAutoScrolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Use a ref for the speed so the animation loop always has the latest value
    const speedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(settings?.autoScrollLevel ?? 3);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCatalogue.useEffect": ()=>{
            speedRef.current = settings?.autoScrollLevel ?? 3;
        }
    }["useCatalogue.useEffect"], [
        settings?.autoScrollLevel
    ]);
    // STOPS THE SCROLL: Immediately cancels the frame and resets state
    const stopAutoScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogue.useCallback[stopAutoScroll]": ()=>{
            if (scrollRef.current !== null) {
                cancelAnimationFrame(scrollRef.current);
                scrollRef.current = null;
            }
            setIsAutoScrolling(false);
        }
    }["useCatalogue.useCallback[stopAutoScroll]"], []);
    // START/TOGGLE LOGIC
    const toggleAutoScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogue.useCallback[toggleAutoScroll]": ()=>{
            if (isAutoScrolling) {
                stopAutoScroll();
                return;
            }
            setIsAutoScrolling(true);
            const scrollStep = {
                "useCatalogue.useCallback[toggleAutoScroll].scrollStep": ()=>{
                    // If the state was set to false, do not schedule next frame
                    if (scrollRef.current === null) return;
                    window.scrollBy({
                        top: speedRef.current,
                        behavior: "auto"
                    });
                    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
                    if (isAtBottom) {
                        stopAutoScroll();
                    } else {
                        scrollRef.current = requestAnimationFrame(scrollStep);
                    }
                }
            }["useCatalogue.useCallback[toggleAutoScroll].scrollStep"];
            // Initialize the first frame
            scrollRef.current = requestAnimationFrame(scrollStep);
        }
    }["useCatalogue.useCallback[toggleAutoScroll]"], [
        isAutoScrolling,
        stopAutoScroll
    ]);
    // FIX: Detect any user interaction to kill the scroll immediately
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCatalogue.useEffect": ()=>{
            const handleInteraction = {
                "useCatalogue.useEffect.handleInteraction": ()=>{
                    // Check if a frame is currently scheduled
                    if (scrollRef.current !== null) {
                        stopAutoScroll();
                    }
                }
            }["useCatalogue.useEffect.handleInteraction"];
            // Capture phase listeners (true) ensure we catch the event before other logic
            window.addEventListener("wheel", handleInteraction, {
                passive: true,
                capture: true
            });
            window.addEventListener("touchstart", handleInteraction, {
                passive: true,
                capture: true
            });
            window.addEventListener("mousedown", handleInteraction, {
                passive: true,
                capture: true
            });
            window.addEventListener("keydown", handleInteraction, {
                passive: true,
                capture: true
            });
            return ({
                "useCatalogue.useEffect": ()=>{
                    window.removeEventListener("wheel", handleInteraction, true);
                    window.removeEventListener("touchstart", handleInteraction, true);
                    window.removeEventListener("mousedown", handleInteraction, true);
                    window.removeEventListener("keydown", handleInteraction, true);
                    if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
                }
            })["useCatalogue.useEffect"];
        }
    }["useCatalogue.useEffect"], [
        stopAutoScroll
    ]);
    // --- FILTER & SORT LOGIC ---
    const filteredAndSortedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCatalogue.useMemo[filteredAndSortedProducts]": ()=>{
            let result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterProducts"])(initialProducts, activeFilters);
            const sorted = [
                ...result
            ];
            switch(sortBy){
                case "price-asc":
                    sorted.sort({
                        "useCatalogue.useMemo[filteredAndSortedProducts]": (a, b)=>a.defaultPrice - b.defaultPrice
                    }["useCatalogue.useMemo[filteredAndSortedProducts]"]);
                    break;
                case "price-desc":
                    sorted.sort({
                        "useCatalogue.useMemo[filteredAndSortedProducts]": (a, b)=>b.defaultPrice - a.defaultPrice
                    }["useCatalogue.useMemo[filteredAndSortedProducts]"]);
                    break;
                case "most-sold":
                    sorted.sort({
                        "useCatalogue.useMemo[filteredAndSortedProducts]": (a, b)=>b.salesCount - a.salesCount
                    }["useCatalogue.useMemo[filteredAndSortedProducts]"]);
                    break;
                case "popularity":
                    sorted.sort({
                        "useCatalogue.useMemo[filteredAndSortedProducts]": (a, b)=>b.popularityScore - a.popularityScore
                    }["useCatalogue.useMemo[filteredAndSortedProducts]"]);
                    break;
                default:
                    sorted.sort({
                        "useCatalogue.useMemo[filteredAndSortedProducts]": (a, b)=>b.staticNumber - a.staticNumber
                    }["useCatalogue.useMemo[filteredAndSortedProducts]"]);
            }
            return sorted;
        }
    }["useCatalogue.useMemo[filteredAndSortedProducts]"], [
        initialProducts,
        activeFilters,
        sortBy
    ]);
    const handleFilterChange = (key, value, isSingleSelect = false)=>{
        setActiveFilters((prev)=>{
            const currentValues = prev[key] || [];
            if (isSingleSelect) return {
                ...prev,
                [key]: [
                    value
                ]
            };
            const newValues = currentValues.includes(value) ? currentValues.filter((v)=>v !== value) : [
                ...currentValues,
                value
            ];
            return {
                ...prev,
                [key]: newValues
            };
        });
    };
    return {
        products: filteredAndSortedProducts,
        activeFilters,
        handleFilterChange,
        sortBy,
        setSortBy,
        totalResults: filteredAndSortedProducts.length,
        isAutoScrolling,
        toggleAutoScroll
    };
};
_s(useCatalogue, "diYizFrtenDMyaE/pnZrqYM86nQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/catalogue/components/catalogue-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CatalogueSidebar",
    ()=>CatalogueSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/store-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const CatalogueSidebar = ({ category, activeFilters, onFilterChange, maxPrice })=>{
    _s();
    const [openSections, setOpenSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        priceRange: true
    });
    // CATEGORY_FILTERS is now exported and typed
    const filters = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_FILTERS"][category] || [];
    const toggleSection = (id)=>{
        setOpenSections((prev)=>({
                ...prev,
                [id]: !prev[id]
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-72 shrink-0 hidden lg:block sticky top-28 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pr-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-black uppercase italic tracking-tighter",
                    children: "Refine"
                }, void 0, false, {
                    fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-border py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>toggleSection("priceRange"),
                        className: "flex w-full items-center justify-between text-[11px] font-black uppercase tracking-widest py-2",
                        children: [
                            "Budget Range",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: `w-4 h-4 transition-transform ${openSections.priceRange ? "rotate-180" : ""}`
                            }, void 0, false, {
                                fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: openSections.priceRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                height: 0,
                                opacity: 0
                            },
                            animate: {
                                height: "auto",
                                opacity: 1
                            },
                            exit: {
                                height: 0,
                                opacity: 0
                            },
                            className: "overflow-hidden pt-4 pb-2 px-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "range",
                                    min: "0",
                                    max: maxPrice,
                                    step: "500",
                                    value: Number((activeFilters.priceRange?.[0] || `0-${maxPrice}`).split("-")[1]),
                                    onChange: (e)=>onFilterChange("priceRange", `0-${e.target.value}`, true),
                                    className: "w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-brand"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between mt-2 text-[10px] font-black opacity-40",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "₹0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "₹",
                                                Number((activeFilters.priceRange?.[0] || `0-${maxPrice}`).split("-")[1]).toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            filters.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-b border-border py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>toggleSection(section.id),
                            className: "flex w-full items-center justify-between text-[11px] font-black uppercase tracking-widest py-2",
                            children: [
                                section.label,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: `w-4 h-4 transition-transform ${openSections[section.id] ? "rotate-180" : ""}`
                                }, void 0, false, {
                                    fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            children: openSections[section.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    height: 0,
                                    opacity: 0
                                },
                                animate: {
                                    height: "auto",
                                    opacity: 1
                                },
                                exit: {
                                    height: 0,
                                    opacity: 0
                                },
                                className: "overflow-hidden pt-2 pb-4 flex flex-wrap gap-2",
                                children: section.options.map((opt)=>{
                                    const isActive = activeFilters[section.id]?.includes(opt);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onFilterChange(section.id, opt),
                                        className: `px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? "bg-foreground text-background border-foreground scale-95" : "bg-background border-border hover:border-foreground/50"}`,
                                        children: opt
                                    }, opt, false, {
                                        fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                                        lineNumber: 122,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0));
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, section.id, true, {
                    fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)))
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/catalogue/components/catalogue-sidebar.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CatalogueSidebar, "gkZTSqaGBv1B+GgU64PcgwDiX0M=");
_c = CatalogueSidebar;
var _c;
__turbopack_context__.k.register(_c, "CatalogueSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/brandLogos.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const brandLogos = [
    {
        name: "Zara",
        slug: "zara",
        color: "#000000",
        logo: "/images/brand-logos/zara.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "YSL",
        slug: "ysl",
        color: "#000000",
        logo: "/images/brand-logos/ysl.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Yeezy",
        slug: "yeezy",
        color: "#F3371F",
        logo: "/images/brand-logos/yeezy.png",
        categories: [
            "sneakers",
            "streetwear"
        ]
    },
    {
        name: "Y-3",
        slug: "y-3",
        color: "#111111",
        logo: "/images/brand-logos/y3.png",
        categories: [
            "luxury",
            "streetwear",
            "fashion"
        ]
    },
    {
        name: "Versace",
        slug: "versace",
        color: "#E8BB2E",
        logo: "/images/brand-logos/versace.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Vans",
        slug: "vans",
        color: "#BA0C2F",
        logo: "/images/brand-logos/vans.png",
        categories: [
            "sneakers",
            "streetwear"
        ]
    },
    {
        name: "Valentino",
        slug: "valentino",
        color: "#E4002B",
        logo: "/images/brand-logos/valentino.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Vacheron Constantin",
        slug: "vacheron-constantin",
        color: "#2B2B2B",
        logo: "/images/brand-logos/vacheronconstantin.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Under Armour",
        slug: "under-armour",
        color: "#000000",
        logo: "/images/brand-logos/underarmour.png",
        categories: [
            "sportswear"
        ]
    },
    {
        name: "Tom Ford",
        slug: "tom-ford",
        color: "#262624",
        logo: "/images/brand-logos/tomford.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Tissot",
        slug: "tissot",
        color: "#E11A27",
        logo: "/images/brand-logos/tissot.png",
        categories: [
            "watches"
        ]
    },
    {
        name: "Tag Heuer",
        slug: "tag-heuer",
        color: "#003224",
        logo: "/images/brand-logos/tagheuer.png",
        categories: [
            "watches",
            "luxury"
        ]
    },
    {
        name: "Supreme",
        slug: "supreme",
        color: "#ED1C24",
        logo: "/images/brand-logos/supreme.png",
        categories: [
            "streetwear"
        ]
    },
    {
        name: "Stüssy",
        slug: "stussy",
        color: "#000000",
        logo: "/images/brand-logos/stussy.png",
        categories: [
            "streetwear"
        ]
    },
    {
        name: "Skechers",
        slug: "skechers-logo",
        color: "#003580",
        logo: "/images/brand-logos/skecherslogo.png",
        categories: [
            "footwear"
        ]
    },
    {
        name: "Skechers",
        slug: "skechers",
        color: "#003580",
        logo: "/images/brand-logos/skechers.png",
        categories: [
            "footwear"
        ]
    },
    {
        name: "Seiko",
        slug: "seiko",
        color: "#002C5F",
        logo: "/images/brand-logos/seiko.png",
        categories: [
            "watches"
        ]
    },
    {
        name: "Samsung",
        slug: "samsung",
        color: "#1428A0",
        logo: "/images/brand-logos/samsung.png",
        categories: [
            "electronics"
        ]
    },
    {
        name: "Rolex",
        slug: "rolex",
        color: "#006039",
        logo: "/images/brand-logos/rolex.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Reebok",
        slug: "reebok",
        color: "#06080A",
        logo: "/images/brand-logos/reebok.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "Ray-Ban",
        slug: "ray-ban",
        color: "#E31837",
        logo: "/images/brand-logos/rayban.png",
        categories: [
            "accessories"
        ]
    },
    {
        name: "Ralph Lauren",
        slug: "ralph-lauren",
        color: "#041E42",
        logo: "/images/brand-logos/ralphlauren.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Rado",
        slug: "rado",
        color: "#1A1A1A",
        logo: "/images/brand-logos/rado.png",
        categories: [
            "watches"
        ]
    },
    {
        name: "Puma",
        slug: "puma",
        color: "#E6312A",
        logo: "/images/brand-logos/puma.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "Prada",
        slug: "prada",
        color: "#000000",
        logo: "/images/brand-logos/prada.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Patek Philippe",
        slug: "patek-philippe",
        color: "#544634",
        logo: "/images/brand-logos/patekphilippe.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Palm Angels",
        slug: "palm-angels",
        color: "#000000",
        logo: "/images/brand-logos/palmangels.png",
        categories: [
            "streetwear"
        ]
    },
    {
        name: "Onitsuka Tiger",
        slug: "onitsuka-tiger",
        color: "#E8112D",
        logo: "/images/brand-logos/onitsukatiger.png",
        categories: [
            "sneakers",
            "sportswear"
        ]
    },
    {
        name: "Omega",
        slug: "omega",
        color: "#C41230",
        logo: "/images/brand-logos/omega.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Off-White",
        slug: "off-white",
        color: "#000000",
        logo: "/images/brand-logos/offwhite.png",
        categories: [
            "streetwear",
            "luxury"
        ]
    },
    {
        name: "Oakley",
        slug: "oakley",
        color: "#000000",
        logo: "/images/brand-logos/oakley.png",
        categories: [
            "accessories",
            "sportswear"
        ]
    },
    {
        name: "Nike",
        slug: "nike",
        color: "#000000",
        logo: "/images/brand-logos/nike.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "New Balance",
        slug: "new-balance",
        color: "#E21837",
        logo: "/images/brand-logos/newbalance.png",
        categories: [
            "sneakers"
        ]
    },
    {
        name: "Montblanc",
        slug: "montblanc",
        color: "#000000",
        logo: "/images/brand-logos/montblanc.png",
        categories: [
            "luxury",
            "accessories"
        ]
    },
    {
        name: "Marshall",
        slug: "marshall",
        color: "#F2CF6C",
        logo: "/images/brand-logos/marshall.png",
        categories: [
            "electronics"
        ]
    },
    {
        name: "Louis Vuitton",
        slug: "louis-vuitton",
        color: "#49362F",
        logo: "/images/brand-logos/louisvuitton.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Hublot",
        slug: "hublot",
        color: "#000000",
        logo: "/images/brand-logos/hublot.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "H&M",
        slug: "h-and-m",
        color: "#E50012",
        logo: "/images/brand-logos/hm.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Hermès",
        slug: "hermes",
        color: "#F37021",
        logo: "/images/brand-logos/hermes.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Gucci",
        slug: "gucci",
        color: "#006747",
        logo: "/images/brand-logos/gucci.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "G-SHOCK",
        slug: "g-shock",
        color: "#E41F26",
        logo: "/images/brand-logos/gshock.png",
        categories: [
            "watches",
            "sportswear"
        ]
    },
    {
        name: "Givenchy",
        slug: "givenchy",
        color: "#000000",
        logo: "/images/brand-logos/givenchy.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Giorgio Armani",
        slug: "giorgio-armani",
        color: "#00002A",
        logo: "/images/brand-logos/giorgioarmani.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Fossil",
        slug: "fossil",
        color: "#322F2A",
        logo: "/images/brand-logos/fossil.png",
        categories: [
            "watches",
            "fashion"
        ]
    },
    {
        name: "Fila",
        slug: "fila",
        color: "#00205B",
        logo: "/images/brand-logos/fila.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "Fendi",
        slug: "fendi",
        color: "#F9B949",
        logo: "/images/brand-logos/fendi.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Fastrack",
        slug: "fastrack",
        color: "#ED1C24",
        logo: "/images/brand-logos/fastrack.png",
        categories: [
            "watches",
            "sportswear"
        ]
    },
    {
        name: "Emporio Armani",
        slug: "emporio-armani",
        color: "#000000",
        logo: "/images/brand-logos/emporioarmani.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Dolce & Gabbana",
        slug: "dolce-gabbana",
        color: "#000000",
        logo: "/images/brand-logos/dolcegabbana.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Dior",
        slug: "dior",
        color: "#000000",
        logo: "/images/brand-logos/dior.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Diesel",
        slug: "diesel",
        color: "#C8102E",
        logo: "/images/brand-logos/diesel.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Crocs",
        slug: "crocs",
        color: "#7EBC00",
        logo: "/images/brand-logos/crocs.png",
        categories: [
            "footwear"
        ]
    },
    {
        name: "Converse",
        slug: "converse",
        color: "#000000",
        logo: "/images/brand-logos/converse.png",
        categories: [
            "sneakers",
            "streetwear"
        ]
    },
    {
        name: "Citizen",
        slug: "citizen",
        color: "#000000",
        logo: "/images/brand-logos/citizen.png",
        categories: [
            "watches"
        ]
    },
    {
        name: "Chanel",
        slug: "chanel",
        color: "#000000",
        logo: "/images/brand-logos/chanel.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Casio",
        slug: "casio",
        color: "#003087",
        logo: "/images/brand-logos/casio.png",
        categories: [
            "watches",
            "electronics"
        ]
    },
    {
        name: "Cartier",
        slug: "cartier",
        color: "#9E1030",
        logo: "/images/brand-logos/cartier.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Calvin Klein",
        slug: "calvin-klein",
        color: "#000000",
        logo: "/images/brand-logos/calvinklein.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Burberry",
        slug: "burberry",
        color: "#D63D2C",
        logo: "/images/brand-logos/burberry.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Bose",
        slug: "bose",
        color: "#1D1D1D",
        logo: "/images/brand-logos/bose.png",
        categories: [
            "electronics"
        ]
    },
    {
        name: "Birkenstock",
        slug: "birkenstock",
        color: "#003261",
        logo: "/images/brand-logos/birkenstock.png",
        categories: [
            "footwear"
        ]
    },
    {
        name: "Balmain Paris",
        slug: "balmain-paris",
        color: "#000000",
        logo: "/images/brand-logos/balmainparis.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Balmain",
        slug: "balmain",
        color: "#000000",
        logo: "/images/brand-logos/balmain.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Balenciaga",
        slug: "balenciaga",
        color: "#000000",
        logo: "/images/brand-logos/balenciaga.png",
        categories: [
            "luxury",
            "fashion",
            "sneakers"
        ]
    },
    {
        name: "Audemars Piguet",
        slug: "audemars-piguet",
        color: "#2B2A29",
        logo: "/images/brand-logos/audemarspiguet.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Asics",
        slug: "asics",
        color: "#001E62",
        logo: "/images/brand-logos/asics.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "Armani Exchange",
        slug: "armani-exchange",
        color: "#000000",
        logo: "/images/brand-logos/armaniexchange.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Apple",
        slug: "apple",
        color: "#555555",
        logo: "/images/brand-logos/apple.png",
        categories: [
            "electronics"
        ]
    },
    {
        name: "Amiri Logo",
        slug: "amiri-logo",
        color: "#000000",
        logo: "/images/brand-logos/amirilogo.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Amiri",
        slug: "amiri",
        color: "#000000",
        logo: "/images/brand-logos/amiri.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Jordan",
        slug: "jordan",
        color: "#000000",
        logo: "/images/brand-logos/airjordan.png",
        categories: [
            "sneakers",
            "streetwear"
        ]
    },
    {
        name: "Adidas",
        slug: "adidas",
        color: "#007FC5",
        logo: "/images/brand-logos/adidas.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    }
];
const __TURBOPACK__default__export__ = brandLogos;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/cards/catlogue-product-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CatalogueProductCard",
    ()=>CatalogueProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$ri$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.1/node_modules/react-icons/ri/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.1/node_modules/react-icons/md/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/brandLogos.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
function CatalogueProductCard({ product }) {
    // Safety check to prevent crashes if a null product enters the grid
    if (!product) return null;
    const getBrandLogoByName = (name)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((brand)=>brand.name.toLowerCase() === name.toLowerCase())?.logo;
    };
    // Helper to get quality from the first variant since it's removed from top-level
    const displayQuality = product.variants?.[0]?.quality || "Standard";
    // Helper to handle original price calculation safely
    const originalPrice = product.variants?.[0]?.ogPrice || product.defaultPrice * 1.5;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        layout: true,
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        className: "group cursor-pointer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: `/product/${product.slug}`,
                className: "block cursor-pointer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "aspect-4/5 overflow-hidden rounded-4xl lg:rounded-[2.5rem] bg-background-muted relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: product.promoImage || "/images/placeholder.png",
                        alt: product.name,
                        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 px-1 space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center text-[8px] md:text-[10px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: getBrandLogoByName(product.brand),
                                alt: product.brand,
                                className: "w-8 invert-0 dark:invert"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex gap-1 px-2 py-0.5 justify-center items-center font-bold border border-border rounded-full uppercase text-blue-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$ri$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RiShieldStarFill"], {}, void 0, false, {
                                        fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    displayQuality
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[14px] font-bold uppercase truncate tracking-tight text-foreground line-clamp-1",
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-[11px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-foreground/50 line-through",
                                            children: [
                                                "₹",
                                                originalPrice.toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-black text-green-500",
                                            children: [
                                                "₹",
                                                product.defaultPrice?.toLocaleString() ?? "N/A"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                                            lineNumber: 72,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1 text-foreground-muted text-[10px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdStars"], {
                                            className: "text-yellow-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this),
                                        " 4.5"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/cards/catlogue-product-card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c = CatalogueProductCard;
var _c;
__turbopack_context__.k.register(_c, "CatalogueProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/catalogue/components/catalogue-grid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CatalogueGrid",
    ()=>CatalogueGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // Fix: Explicitly import React to resolve UMD global error
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$cards$2f$catlogue$2d$product$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/cards/catlogue-product-card.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
const CatalogueGrid = ({ products })=>{
    // Logic: In a 3-column grid (xl), 3 rows equals 9 items
    const ITEMS_PER_PROMO = 4;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 xl:grid-cols-4 gap-4 gap-y-8 pt-8 md:pt-28",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    mode: "popLayout",
                    children: products.map((product, index)=>{
                        const isPromoPosition = (index + 1) % ITEMS_PER_PROMO === 0;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    layout: true,
                                    initial: {
                                        opacity: 0,
                                        scale: 0.9
                                    },
                                    animate: {
                                        opacity: 1,
                                        scale: 1
                                    },
                                    exit: {
                                        opacity: 0,
                                        scale: 0.9
                                    },
                                    transition: {
                                        duration: 0.3
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$cards$2f$catlogue$2d$product$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatalogueProductCard"], {
                                        product: product
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                                        lineNumber: 32,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                                    lineNumber: 25,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                isPromoPosition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    layout: true,
                                    initial: {
                                        opacity: 0,
                                        y: 20
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    className: "col-span-2 xl:col-span-2 h-full md:h-full rounded-4xl bg-background overflow-hidden relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: "/gif/ad.gif",
                                            alt: "Promotion",
                                            className: "w-full h-full object-cover scale-105 "
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                                            lineNumber: 43,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-black/20 flex flex-col justify-center px-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-white font-black italic uppercase text-2xl tracking-tighter",
                                                    children: "Exclusive Drop"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                                                    lineNumber: 49,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-white/60 text-[10px] font-bold uppercase tracking-widest",
                                                    children: "Premium Quality Guaranteed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                                                    lineNumber: 52,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                                            lineNumber: 48,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                                    lineNumber: 37,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, product.id, true, {
                            fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                            lineNumber: 24,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                }, void 0, false, {
                    fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            products.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-32 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "opacity-30 text-[10px] font-black uppercase tracking-widest",
                    children: "No Gear Matches Your Current Refinement"
                }, void 0, false, {
                    fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                    lineNumber: 67,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/catalogue/components/catalogue-grid.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CatalogueGrid;
var _c;
__turbopack_context__.k.register(_c, "CatalogueGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/catalogue/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CatalogueClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$hooks$2f$use$2d$catalogue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/catalogue/hooks/use-catalogue.ts [app-client] (ecmascript)");
// Sub-component Imports
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$components$2f$catalogue$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/catalogue/components/catalogue-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$components$2f$catalogue$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/catalogue/components/catalogue-grid.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// Sort Options for both Desktop Select and Mobile Drawer
const SORT_OPTIONS = [
    {
        label: "Newest Arrivals",
        value: "newest"
    },
    {
        label: "Price: Low to High",
        value: "price-asc"
    },
    {
        label: "Price: High to Low",
        value: "price-desc"
    },
    {
        label: "Most Popular",
        value: "popularity"
    },
    {
        label: "Best Sellers",
        value: "most-sold"
    }
];
function CatalogueClient({ type, title, initialProducts, categorySlug }) {
    _s();
    // 1. EXTRACT LOGIC FROM HOOK
    // All filtering, sorting, and auto-scroll logic is centralized here
    const { products, activeFilters, handleFilterChange, sortBy, setSortBy, totalResults, isAutoScrolling, toggleAutoScroll } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$hooks$2f$use$2d$catalogue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCatalogue"])({
        initialProducts
    });
    // 2. UI STATE
    const [activeDrawer, setActiveDrawer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Calculate max price for the budget slider
    const maxPrice = Math.max(...initialProducts.map((p)=>p.defaultPrice), 10000);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background min-h-screen text-foreground transition-colors duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky md:hidden top-16 z-30 bg-background border-y border-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex h-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveDrawer("filter"),
                            className: "flex-1 flex lg:hidden items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border hover:bg-background-muted transition-all outline-none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                " Filter"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/catalogue/index.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: toggleAutoScroll,
                            className: `flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border transition-all outline-none ${isAutoScrolling ? "text-brand bg-brand/5" : ""}`,
                            children: [
                                isAutoScrolling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                    size: 12,
                                    className: "fill-current"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                    lineNumber: 98,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                    size: 12,
                                    className: "fill-current"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this),
                                isAutoScrolling ? "Scrolling" : "Auto Scroll"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/catalogue/index.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex items-center justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveDrawer("sort"),
                                    className: "lg:hidden flex items-center gap-2 text-[10px] font-black uppercase tracking-widest outline-none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                            size: 13
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/catalogue/index.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this),
                                        " Sort"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden lg:flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-black uppercase opacity-40",
                                            children: "Sort By:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/catalogue/index.tsx",
                                            lineNumber: 116,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: sortBy,
                                            onChange: (e)=>setSortBy(e.target.value),
                                            className: "bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer",
                                            children: SORT_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: opt.value,
                                                    children: opt.label
                                                }, opt.value, false, {
                                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/catalogue/index.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/catalogue/index.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/features/catalogue/index.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/features/catalogue/index.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mx-auto flex flex-col lg:flex-row  pb-20 px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden lg:block w-76 shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$components$2f$catalogue$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatalogueSidebar"], {
                            category: categorySlug,
                            activeFilters: activeFilters,
                            onFilterChange: handleFilterChange,
                            maxPrice: maxPrice
                        }, void 0, false, {
                            fileName: "[project]/src/features/catalogue/index.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/catalogue/index.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$components$2f$catalogue$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatalogueGrid"], {
                        products: products
                    }, void 0, false, {
                        fileName: "[project]/src/features/catalogue/index.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/catalogue/index.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: activeDrawer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            onClick: ()=>setActiveDrawer(null),
                            className: "fixed inset-0 z-60 bg-background/60 backdrop-blur-sm"
                        }, void 0, false, {
                            fileName: "[project]/src/features/catalogue/index.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                y: "100%"
                            },
                            animate: {
                                y: 0
                            },
                            exit: {
                                y: "100%"
                            },
                            transition: {
                                type: "spring",
                                damping: 25,
                                stiffness: 200
                            },
                            className: "fixed bottom-0 left-0 right-0 z-70 bg-background border-t border-border rounded-t-4xl max-h-[85vh] flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full flex justify-center py-5 shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-12 h-1 bg-border rounded-full opacity-30"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/catalogue/index.tsx",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-8 pb-10 overflow-y-auto no-scrollbar",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[10px] font-black uppercase tracking-widest mb-6 text-foreground-subtle border-b border-border/10 pb-4",
                                            children: activeDrawer === "filter" ? "REFINE SEARCH" : "SORT RESULTS"
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/catalogue/index.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this),
                                        activeDrawer === "sort" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: SORT_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setSortBy(opt.value);
                                                        setActiveDrawer(null);
                                                    },
                                                    className: "w-full flex items-center justify-between py-5 border-b border-border last:border-none",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-[11px] uppercase tracking-widest ${sortBy === opt.value ? "font-black text-brand" : "font-bold opacity-60"}`,
                                                            children: opt.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/catalogue/index.tsx",
                                                            lineNumber: 192,
                                                            columnNumber: 25
                                                        }, this),
                                                        sortBy === opt.value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-2 h-2 bg-brand rounded-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/features/catalogue/index.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, opt.value, true, {
                                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/features/catalogue/index.tsx",
                                            lineNumber: 182,
                                            columnNumber: 19
                                        }, this) : /* Mobile Filter Context */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-bold opacity-40 italic",
                                                    children: "Mobile filtering is currently simplified. Use desktop for full budget range and color refinements."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setActiveDrawer(null),
                                                    className: "w-full py-4 bg-foreground text-background rounded-full font-black uppercase text-[11px] tracking-widest",
                                                    children: "Close and View Results"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/features/catalogue/index.tsx",
                                            lineNumber: 209,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/catalogue/index.tsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/catalogue/index.tsx",
                            lineNumber: 165,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/src/features/catalogue/index.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/catalogue/index.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(CatalogueClient, "ctFQPSybi3mUVyagQ7v8OomTN58=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$hooks$2f$use$2d$catalogue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCatalogue"]
    ];
});
_c = CatalogueClient;
var _c;
__turbopack_context__.k.register(_c, "CatalogueClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0adb0cb5._.js.map