module.exports = [
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/data/store-data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/data/store-data.ts
// --- TYPES ---
__turbopack_context__.s([
    "CATEGORY_FILTERS",
    ()=>CATEGORY_FILTERS,
    "MOCK_PRODUCTS",
    ()=>MOCK_PRODUCTS,
    "filterProducts",
    ()=>filterProducts,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getSimilarProducts",
    ()=>getSimilarProducts
]);
const MOCK_PRODUCTS = [
    // --- SNEAKERS ---
    {
        id: 's1',
        slug: 'kobe-iii-protro-white',
        name: 'Kobe III Protro',
        price: 8500,
        category: 'sneakers',
        brand: 'Nike',
        gender: 'unisex',
        size: 'EU 42',
        color: 'White',
        quality: 'UA',
        stock: 15,
        description: 'The Kobe III Protro scales back the weight while maintaining the iconic silhouette. Engineered for performance.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fbeaf128-4abc-44ff-8fae-08a6dd8b1852/KOBE+III+PROTRO.png',
        liveImages: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800'
        ],
        videoUrl: 'f1vW2Pqc6Cc',
        popularityScore: 95,
        salesCount: 120,
        discount: 10,
        reviews: [
            {
                userName: "Arjun S.",
                userImage: "https://i.pravatar.cc/150?u=1",
                rating: 5,
                comment: "Insane quality.",
                date: "2 days ago"
            }
        ]
    },
    {
        id: 's2',
        slug: 'sb-dunk-low-pro-black',
        name: 'SB Dunk Low Pro',
        price: 9200,
        category: 'sneakers',
        brand: 'Nike',
        gender: 'men',
        size: 'EU 44',
        color: 'Black',
        quality: 'Semi UA',
        stock: 8,
        description: 'Classic skating silhouette in a stealthy black finish. Semi UA grade ensures high-quality materials.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png',
        liveImages: [
            'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=800'
        ],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 88,
        salesCount: 200,
        discount: 5,
        reviews: []
    },
    {
        id: 's3',
        slug: 'air-jordan-1-low-qs-red',
        name: 'Air Jordan 1 Low',
        price: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 0,
        description: 'The classic AJ1 silhouette in a low-cut profile. UA grade leather and detailing.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2be76228-ff51-4c87-b120-e7be37db4d2e/AIR+FORCE+1+LOW+QS.png',
        liveImages: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800'
        ],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        reviews: []
    },
    // Adding duplicates from your old list as unique slugs
    {
        id: 's4',
        slug: 'zoom-gp-challenge-prm',
        name: 'Zoom GP Challenge 1.5',
        price: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        description: 'Premium sports performance.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85f69d4c-7a54-4e31-be57-d8896a73f341/W+ZOOM+GP+CHALLENGE+1.5+HC+PRM.png',
        liveImages: [],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        reviews: []
    },
    {
        id: 's5',
        slug: 'zoom-gp-challenge-pro',
        name: 'Zoom GP Challenge Pro',
        price: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        description: 'Pro level court control.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
        liveImages: [],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        reviews: []
    },
    {
        id: 's6',
        slug: 'air-force-1-mini-jewel',
        name: 'AF1 Mini Jewel',
        price: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        description: 'Elegant mini jewel detailing.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0fcbdc68-279b-4e41-bd31-ea3879164798/W+AIR+FORCE+1+%2707+MINI+JEWEL.png',
        liveImages: [],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        reviews: []
    },
    {
        id: 's7',
        slug: 'air-force-1-07-classic',
        name: 'Air Force 1 \'07',
        price: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        description: 'The original 1982 classic.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/fc4622c4-2769-4665-aa6e-42c974a7705e/AIR+FORCE+1+%2707.png',
        liveImages: [],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        reviews: []
    },
    {
        id: 's8',
        slug: 'air-force-1-07-prm',
        name: 'Air Force 1 \'07 PRM',
        price: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        description: 'Premium material construction.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d217b510-81ac-429c-9881-8103c306e210/W+AIR+FORCE+1+%2707+PRM.png',
        liveImages: [],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 99,
        salesCount: 350,
        discount: 25,
        reviews: []
    },
    // --- WATCHES ---
    {
        id: 'w1',
        slug: 'automatic-diver-silver',
        name: 'Automatic Diver',
        price: 9500,
        category: 'watches',
        brand: 'Seiko',
        gender: 'men',
        size: '40mm',
        material: 'Steel',
        color: 'Silver',
        quality: '7AA',
        stock: 5,
        description: '7AA Grade automatic movement. Solid stainless steel construction.',
        promoImage: 'https://www.swisstimehouse.com/199560-home_default/titan-90217sl02.jpg',
        liveImages: [
            'https://images.unsplash.com/photo-1523170335258-f5ed11844a11?auto=format&fit=crop&w=800'
        ],
        videoUrl: 'M7lc1UVf-VE',
        popularityScore: 75,
        salesCount: 45,
        discount: 15,
        reviews: []
    },
    {
        id: 'w2',
        slug: 'g-shock-carbon-black',
        name: 'G-Shock Carbon',
        price: 6800,
        category: 'watches',
        brand: 'Casio',
        gender: 'unisex',
        size: '42mm',
        material: 'Resin',
        color: 'Black',
        quality: '10A',
        stock: 20,
        description: 'Indestructible G-Shock carbon core technology.',
        promoImage: "https://www.swisstimehouse.com/199552-home_default/titan-90217ql01.jpg",
        liveImages: [],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 92,
        salesCount: 150,
        discount: 0,
        reviews: []
    },
    // --- CLOTHES ---
    {
        id: 'c1',
        slug: 'zara-oversized-cotton-tee',
        name: 'Oversized Cotton Tee',
        price: 1200,
        category: 'cloths',
        brand: 'Zara',
        gender: 'unisex',
        material: 'Cotton',
        color: 'White',
        quality: 'Standard',
        stock: 50,
        description: 'Premium heavyweight cotton tee with a modern oversized fit.',
        promoImage: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20240313/pglM/65f0d70f05ac7d77bbaf22ed/-473Wx593H-467162483-multi-MODEL.jpg',
        liveImages: [],
        videoUrl: 'dQw4w9WgXcQ',
        popularityScore: 80,
        salesCount: 500,
        discount: 20,
        reviews: []
    }
];
const CATEGORY_FILTERS = {
    sneakers: [
        {
            id: 'brand',
            label: 'Brand',
            options: [
                "Nike",
                "Adidas",
                "Puma",
                "Jordan",
                "Yeezy",
                "New Balance",
                "Vans",
                "Asics",
                "Converse",
                "Reebok",
                "Fila",
                "Skechers",
                "Onitsuka Tiger",
                "Balenciaga",
                "Gucci",
                "Louis Vuitton",
                "Off-White",
                "Palm Angels",
                "Birkenstock",
                "Crocs"
            ]
        },
        {
            id: 'quality',
            label: 'Quality Grade',
            options: [
                'UA',
                'Semi UA',
                'Master Copy',
                '7A',
                'Standard'
            ]
        },
        {
            id: 'size',
            label: 'Size',
            options: [
                'EU 38',
                'EU 39',
                'EU 40',
                'EU 41',
                'EU 42',
                'EU 43',
                'EU 44',
                'EU 45'
            ]
        },
        {
            id: 'color',
            label: 'Color',
            options: [
                'Black',
                'White',
                'Blue',
                'Red',
                'Grey'
            ]
        }
    ],
    watches: [
        {
            id: 'brand',
            label: 'Brand',
            options: [
                "Rolex",
                "Seiko",
                "Casio",
                "G-SHOCK",
                "Tissot",
                "Titan",
                "Fastrack",
                "Fossil",
                "Citizen",
                "Rado",
                "Omega",
                "Tag Heuer",
                "Hublot",
                "Patek Philippe",
                "Audemars Piguet",
                "Vacheron Constantin",
                "Cartier",
                "Emporio Armani",
                "Giorgio Armani",
                "Armani Exchange",
                "Montblanc"
            ]
        },
        {
            id: 'quality',
            label: 'Quality Grade',
            options: [
                '7AA',
                '10A',
                '7A',
                '5A',
                'Master Copy'
            ]
        },
        {
            id: 'material',
            label: 'Material',
            options: [
                'Steel',
                'Leather',
                'Resin',
                'Silicone'
            ]
        },
        {
            id: 'color',
            label: 'Color',
            options: [
                'Gold',
                'Silver',
                'Black',
                'Grey'
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
                "Louis Vuitton",
                "Gucci",
                "Prada",
                "Palm Angels",
                "Balenciaga",
                "Burberry",
                "Calvin Klein",
                "Dolce & Gabbana",
                "Emporio Armani",
                "Giorgio Armani",
                "Armani Exchange",
                "Givenchy",
                "Fendi",
                "Versace",
                "Hermès",
                "Off-White",
                "Amiri",
                "Balmain",
                "Ralph Lauren",
                "Tom Ford",
                "Supreme",
                "Stüssy",
                "Nike",
                "Adidas",
                "Puma",
                "Fila"
            ]
        },
        {
            id: 'quality',
            label: 'Quality Grade',
            options: [
                'Master Copy',
                '7A',
                'Standard'
            ]
        },
        {
            id: 'size',
            label: 'Size',
            options: [
                'S',
                'M',
                'L',
                'XL',
                'XXL'
            ]
        },
        {
            id: 'color',
            label: 'Color',
            options: [
                'Black',
                'White',
                'Blue',
                'Grey',
                'Green',
                'Red'
            ]
        }
    ],
    slippers: [
        {
            id: 'brand',
            label: 'Brand',
            options: [
                "Nike",
                "Adidas",
                "Puma",
                "Yeezy",
                "Crocs",
                "Birkenstock",
                "Fila",
                "Skechers",
                "H&M",
                "Zara",
                "Gucci",
                "Louis Vuitton",
                "Prada",
                "Balenciaga",
                "Versace"
            ]
        },
        {
            id: 'quality',
            label: 'Quality Grade',
            options: [
                'UA',
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
                'Blue',
                'Brown'
            ]
        }
    ],
    accessories: [
        {
            id: 'brand',
            label: 'Brand',
            options: [
                "Ray-Ban",
                "Oakley",
                "Gucci",
                "Fossil",
                "Casio",
                "Apple",
                "Louis Vuitton",
                "Prada",
                "Hermès",
                "Burberry",
                "Calvin Klein",
                "Emporio Armani",
                "Armani Exchange",
                "Montblanc",
                "Versace",
                "Dior",
                "Chanel",
                "Balenciaga",
                "Off-White",
                "Supreme",
                "G-SHOCK",
                "Samsung",
                "Bose",
                "Marshall"
            ]
        },
        {
            id: 'quality',
            label: 'Quality Grade',
            options: [
                'Master Copy',
                '7A',
                'Standard'
            ]
        },
        {
            id: 'color',
            label: 'Color',
            options: [
                'Black',
                'Gold',
                'Silver',
                'Brown'
            ]
        }
    ]
};
async function getProductBySlug(slug) {
    return MOCK_PRODUCTS.find((p)=>p.slug === slug);
}
async function getSimilarProducts(category, excludeId) {
    return MOCK_PRODUCTS.filter((p)=>p.category === category && p.id !== excludeId).slice(0, 4);
}
function filterProducts(products, activeFilters) {
    return products.filter((product)=>{
        for (const [filterKey, selectedOptions] of Object.entries(activeFilters)){
            if (!selectedOptions || selectedOptions.length === 0) continue;
            if (filterKey === 'priceRange') {
                const rangeString = selectedOptions[0];
                if (!rangeString) continue;
                const [min, max] = rangeString.split('-').map(Number);
                if (product.price < min || product.price > max) return false;
                continue;
            }
            const productValue = product[filterKey];
            if (productValue === undefined || productValue === null) return false;
            const normalizedProductValue = productValue.toString().toLowerCase();
            const matches = selectedOptions.some((option)=>option.toLowerCase() === normalizedProductValue);
            if (!matches) return false;
        }
        return true;
    });
}
}),
"[project]/src/app/product/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/store-data.ts [app-rsc] (ecmascript)");
;
;
async function generateMetadata({ params }) {
    const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductBySlug"])(params.slug);
    if (!product) return {
        title: "Product Not Found"
    };
    return {
        title: `${product.name} | Fashion Friday`,
        description: product.description,
        openGraph: {
            images: [
                {
                    url: product.promoImage
                }
            ],
            type: "website"
        },
        alternates: {
            canonical: `https://yourdomain.com/p/${params.slug}`
        }
    };
}
async function Page({ params }) {
    const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductBySlug"])(params.slug);
    // if (!product) notFound();
    //   const similar = await getSimilarProducts(product.category);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
        children: "hello chcking"
    }, void 0, false, {
        fileName: "[project]/src/app/product/[slug]/page.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/product/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/product/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__21e5c687._.js.map