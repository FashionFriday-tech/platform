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
    // --- 1. STATE FOR FILTERING & SORTING ---
    const [activeFilters, setActiveFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFilters);
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("newest");
    // --- 2. AUTO-SCROLL ENGINE LOGIC ---
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const [isAutoScrolling, setIsAutoScrolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Speed is derived from your global settings (autoScrollLevel)
    const currentScrollSpeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCatalogue.useMemo[currentScrollSpeed]": ()=>settings?.autoScrollLevel ?? 3
    }["useCatalogue.useMemo[currentScrollSpeed]"], [
        settings?.autoScrollLevel
    ]);
    const stopAutoScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogue.useCallback[stopAutoScroll]": ()=>{
            setIsAutoScrolling(false);
            if (scrollRef.current) {
                cancelAnimationFrame(scrollRef.current);
                scrollRef.current = null;
            }
        }
    }["useCatalogue.useCallback[stopAutoScroll]"], []);
    const toggleAutoScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogue.useCallback[toggleAutoScroll]": ()=>{
            if (isAutoScrolling) {
                stopAutoScroll();
                return;
            }
            setIsAutoScrolling(true);
            const scrollStep = {
                "useCatalogue.useCallback[toggleAutoScroll].scrollStep": ()=>{
                    window.scrollBy({
                        top: currentScrollSpeed,
                        behavior: "auto"
                    });
                    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
                    if (isAtBottom) {
                        stopAutoScroll();
                        return;
                    }
                    scrollRef.current = requestAnimationFrame(scrollStep);
                }
            }["useCatalogue.useCallback[toggleAutoScroll].scrollStep"];
            scrollRef.current = requestAnimationFrame(scrollStep);
        }
    }["useCatalogue.useCallback[toggleAutoScroll]"], [
        isAutoScrolling,
        currentScrollSpeed,
        stopAutoScroll
    ]);
    // Emergency stop on manual user interaction
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCatalogue.useEffect": ()=>{
            const handleManualStop = {
                "useCatalogue.useEffect.handleManualStop": ()=>{
                    if (isAutoScrolling) stopAutoScroll();
                }
            }["useCatalogue.useEffect.handleManualStop"];
            window.addEventListener("wheel", handleManualStop, {
                passive: true
            });
            window.addEventListener("touchstart", handleManualStop, {
                passive: true
            });
            window.addEventListener("mousedown", handleManualStop, {
                passive: true
            });
            return ({
                "useCatalogue.useEffect": ()=>{
                    window.removeEventListener("wheel", handleManualStop);
                    window.removeEventListener("touchstart", handleManualStop);
                    window.removeEventListener("mousedown", handleManualStop);
                }
            })["useCatalogue.useEffect"];
        }
    }["useCatalogue.useEffect"], [
        isAutoScrolling,
        stopAutoScroll
    ]);
    // --- 3. THE ENGINE: FILTER AND SORT LOGIC ---
    const filteredAndSortedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCatalogue.useMemo[filteredAndSortedProducts]": ()=>{
            // Apply the universal filter engine from store-data
            let result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterProducts"])(initialProducts, activeFilters);
            // Apply Sorting
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
    // --- 4. HANDLERS ---
    const handleFilterChange = (key, value, isSingleSelect = false)=>{
        setActiveFilters((prev)=>{
            const currentValues = prev[key] || [];
            if (isSingleSelect) {
                return {
                    ...prev,
                    [key]: [
                        value
                    ]
                };
            }
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
    const clearFilters = ()=>setActiveFilters({});
    return {
        products: filteredAndSortedProducts,
        activeFilters,
        handleFilterChange,
        clearFilters,
        sortBy,
        setSortBy,
        totalResults: filteredAndSortedProducts.length,
        // Scrolling Exports
        isAutoScrolling,
        toggleAutoScroll,
        stopAutoScroll
    };
};
_s(useCatalogue, "iS79BDNov/EGqRBFYUKA13AaUsM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/catalogue/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/features/catalogue/index.tsx
__turbopack_context__.s([
    "default",
    ()=>CatalogueClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$hooks$2f$use$2d$catalogue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/catalogue/hooks/use-catalogue.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function CatalogueClient({ type, title, initialProducts, categorySlug }) {
    _s();
    const { products, sortBy, setSortBy, isAutoScrolling, toggleAutoScroll, totalResults } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$catalogue$2f$hooks$2f$use$2d$catalogue$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCatalogue"])({
        initialProducts
    });
    const [activeDrawer, setActiveDrawer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky top-16 z-30 bg-background border-y border-border flex h-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveDrawer("filter"),
                        className: "flex-1 lg:hidden flex items-center justify-center gap-2 text-[10px] font-black uppercase",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/src/features/catalogue/index.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            " Filter"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/catalogue/index.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleAutoScroll,
                        className: `flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase ${isAutoScrolling ? "text-brand" : ""}`,
                        children: [
                            isAutoScrolling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                size: 12,
                                fill: "currentColor"
                            }, void 0, false, {
                                fileName: "[project]/src/features/catalogue/index.tsx",
                                lineNumber: 36,
                                columnNumber: 30
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                size: 12,
                                fill: "currentColor"
                            }, void 0, false, {
                                fileName: "[project]/src/features/catalogue/index.tsx",
                                lineNumber: 36,
                                columnNumber: 73
                            }, this),
                            isAutoScrolling ? "Scrolling" : "Auto Scroll"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/catalogue/index.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveDrawer("sort"),
                        className: "flex-1 lg:hidden flex items-center justify-center gap-2 text-[10px] font-black uppercase",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/src/features/catalogue/index.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            " Sort"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/catalogue/index.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/catalogue/index.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mx-auto flex flex-col lg:flex-row gap-12 py-12 px-4"
            }, void 0, false, {
                fileName: "[project]/src/features/catalogue/index.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/catalogue/index.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(CatalogueClient, "iYBaW5v3fl4XsvcRLQSAWwsYMxA=", false, function() {
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

//# sourceMappingURL=src_b2992c69._.js.map