(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/data/store-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
        price: 2499,
        ogPrice: 9999,
        category: 'sneakers',
        brand: 'Nike',
        gender: 'unisex',
        size: 'EU 42',
        color: 'White',
        quality: 'UA',
        stock: 15,
        staticNumber: 3,
        description: 'The Kobe III Protro scales back the weight while maintaining the iconic silhouette. Engineered for performance.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fbeaf128-4abc-44ff-8fae-08a6dd8b1852/KOBE+III+PROTRO.png',
        liveImages: [
            'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTyPiwCw81Am4QRb1ErRMSIok8zWovJPXd6H7HtCZCvmCXutALe4Y4SOKA9izLJ4EcFWkQ7Raw5lXWlMISpQNT5PGLhK_qLgyyj3BXT406EjOC-6h4TwlPFXAQ',
            'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQOMtpWEr9ToxBB8gyiEr9IH3oI5dSFVgmY7TNdiuYxc-kO7-78-5ku3NqP67XHudhGF47w41Lx3WX4sXQQdJpjg7SLned6FZObzxYiMiZLQ4ICJLaPsyytcQ',
            'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRp43J2ZXKH0dSP33mGk4o4zxaU_eP6zMv-bD-jKBVnOuHwPf1fyK1fM5LWymySiIqDRUHxNTwPWdDgbv5p5oufIOgU40oRdDFvmDr9q0GJjXVCSfQx0F630dF2',
            'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRlCVLe5kdbj7PXSxElAsN4kYVP0k80fCfeEtkKsK64GyRdNoljDRQ5uZLa3yLG_Xll2VUbl0ogsM87fPjcuAqAKgdtjhdR_Q',
            'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTZ2gmN7Sr6sAfRN32cVfzoxTsEeW_SlFOJGIx1yP-GrU4kMjmmO0TUS4PnDf7yBBPZ0Gp51McGzsE8O7ySgEljugB0XxDf'
        ],
        videoUrl: 'nsWzL9PFB8k',
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
        ogPrice: 9999,
        category: 'sneakers',
        brand: 'Nike',
        gender: 'men',
        size: 'EU 44',
        color: 'Black',
        quality: 'Semi UA',
        stock: 8,
        staticNumber: 2,
        description: 'Classic skating silhouette in a stealthy black finish. Semi UA grade ensures high-quality materials.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png',
        liveImages: [
            'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=800'
        ],
        videoUrl: 'qi7IM5UshIo',
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
        ogPrice: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 0,
        staticNumber: 4,
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
        ogPrice: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        staticNumber: 3,
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
        ogPrice: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        staticNumber: 2,
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
        ogPrice: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        staticNumber: 5,
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
        ogPrice: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        staticNumber: 7,
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
        ogPrice: 9999,
        category: 'sneakers',
        brand: 'Jordan',
        gender: 'men',
        size: 'EU 42',
        color: 'Red',
        quality: 'UA',
        isSale: true,
        stock: 10,
        staticNumber: 4,
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
        ogPrice: 9999,
        category: 'watches',
        brand: 'Seiko',
        gender: 'men',
        size: '40mm',
        material: 'Steel',
        color: 'Silver',
        quality: '7AA',
        stock: 5,
        staticNumber: 3,
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
        ogPrice: 9999,
        category: 'watches',
        brand: 'Casio',
        gender: 'unisex',
        size: '42mm',
        material: 'Resin',
        color: 'Black',
        quality: '10A',
        stock: 20,
        staticNumber: 5,
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
        ogPrice: 9999,
        category: 'cloths',
        brand: 'Zara',
        gender: 'unisex',
        material: 'Cotton',
        color: 'White',
        quality: 'Standard',
        stock: 50,
        staticNumber: 7,
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
async function getSimilarProducts(category) {
    return MOCK_PRODUCTS.filter((p)=>p.category === category).slice(0, 4);
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
"[project]/src/components/ui/cards/StoreProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreProductCard",
    ()=>StoreProductCard
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
function StoreProductCard({ product }) {
    const getBrandLogoByName = (name)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((brand)=>brand.name.toLowerCase() === name.toLowerCase())?.logo;
    };
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
                        fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 px-1 space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center text-[8px] md:text-[10px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: getBrandLogoByName(product.brand),
                                alt: product.brand,
                                className: "w-8 invert-0 dark:invert"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex gap-1 justify-center items-center font-bold border border-border  rounded-full  uppercase text-blue-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$ri$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RiShieldStarFill"], {
                                        className: " "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                                        lineNumber: 47,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    product.quality
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[14px] font-bold uppercase truncate tracking-tight text-foreground line-clamp-1",
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                        lineNumber: 51,
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
                                                (product.price * 1.5).toLocaleString(),
                                                " "
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-black text-green-500",
                                            children: [
                                                "₹",
                                                product.price.toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                                            lineNumber: 61,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1 text-foreground-muted text-[10px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdStars"], {
                                            className: "text-yellow-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                                            lineNumber: 66,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        product.rating || "4.5"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/cards/StoreProductCard.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = StoreProductCard;
var _c;
__turbopack_context__.k.register(_c, "StoreProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(shop)/brands/[brand]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrandClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/store-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/brandLogos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$cards$2f$StoreProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/cards/StoreProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SettingsContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function BrandClient({ brandSlug }) {
    _s();
    // 1. DATA PREPARATION
    const brandInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BrandClient.useMemo[brandInfo]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find({
                "BrandClient.useMemo[brandInfo]": (b)=>b.name.toLowerCase() === brandSlug.toLowerCase()
            }["BrandClient.useMemo[brandInfo]"]);
        }
    }["BrandClient.useMemo[brandInfo]"], [
        brandSlug
    ]);
    const products = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BrandClient.useMemo[products]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PRODUCTS"].filter({
                "BrandClient.useMemo[products]": (p)=>p.brand.toLowerCase() === brandSlug.toLowerCase()
            }["BrandClient.useMemo[products]"]);
        }
    }["BrandClient.useMemo[products]"], [
        brandSlug
    ]);
    const maxPriceLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BrandClient.useMemo[maxPriceLimit]": ()=>{
            if (products.length === 0) return 10000;
            return Math.ceil(Math.max(...products.map({
                "BrandClient.useMemo[maxPriceLimit]": (p)=>p.price
            }["BrandClient.useMemo[maxPriceLimit]"])) / 1000) * 1000;
        }
    }["BrandClient.useMemo[maxPriceLimit]"], [
        products
    ]);
    // 2. STATE & UI CONTROLS
    const [activeDrawer, setActiveDrawer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("newest");
    const [isAutoScrolling, setIsAutoScrolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const [activeFilters, setActiveFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        priceRange: [
            `0-${maxPriceLimit}`
        ]
    });
    // 3. AUTO SCROLL ENGINE (Logic preserved from your Category page)
    const currentScrollSpeed = settings?.autoScrollLevel ?? 3;
    const stopAutoScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BrandClient.useCallback[stopAutoScroll]": ()=>{
            setIsAutoScrolling(false);
            if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
        }
    }["BrandClient.useCallback[stopAutoScroll]"], []);
    const toggleAutoScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BrandClient.useCallback[toggleAutoScroll]": ()=>{
            if (isAutoScrolling) {
                stopAutoScroll();
                return;
            }
            setIsAutoScrolling(true);
            const scrollStep = {
                "BrandClient.useCallback[toggleAutoScroll].scrollStep": ()=>{
                    window.scrollBy({
                        top: currentScrollSpeed,
                        behavior: "auto"
                    });
                    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
                        stopAutoScroll();
                        return;
                    }
                    scrollRef.current = requestAnimationFrame(scrollStep);
                }
            }["BrandClient.useCallback[toggleAutoScroll].scrollStep"];
            scrollRef.current = requestAnimationFrame(scrollStep);
        }
    }["BrandClient.useCallback[toggleAutoScroll]"], [
        isAutoScrolling,
        currentScrollSpeed,
        stopAutoScroll
    ]);
    // 4. FILTERED DATA
    const filteredProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BrandClient.useMemo[filteredProducts]": ()=>{
            let result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterProducts"])(products, activeFilters);
            // ... insert your existing sorting logic here (price-asc, etc.)
            return result;
        }
    }["BrandClient.useMemo[filteredProducts]"], [
        products,
        activeFilters,
        sortBy
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background min-h-screen text-foreground transition-colors duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "pt-24 pb-12 border-b border-border px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto flex flex-col items-center text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].img, {
                            initial: {
                                y: 20,
                                opacity: 0
                            },
                            animate: {
                                y: 0,
                                opacity: 1
                            },
                            src: brandInfo?.logo,
                            alt: brandSlug,
                            className: "h-16 mb-6 object-contain dark:invert"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4",
                            children: [
                                brandSlug,
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-brand",
                                    children: "®"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                    lineNumber: 86,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "max-w-xl text-[11px] font-bold uppercase tracking-widest opacity-60 leading-relaxed",
                            children: [
                                "Premium collection featuring the latest drops and exclusive releases from ",
                                brandSlug,
                                ". Engineered for performance, designed for the streets."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky lg:hidden top-16 z-30 bg-background border-b border-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveDrawer("filter"),
                            className: "flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase border-r border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                " Filter"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: toggleAutoScroll,
                            className: `flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase border-r border-border ${isAutoScrolling ? "text-brand" : ""}`,
                            children: [
                                isAutoScrolling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                    size: 12,
                                    className: "fill-current"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 32
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                    size: 12,
                                    className: "fill-current"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 80
                                }, this),
                                "Scroll"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveDrawer("sort"),
                            className: "flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this),
                                " Sort"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mx-auto flex gap-12 pt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "hidden lg:block w-76 shrink-0 sticky top-26 h-fit pr-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-surface-muted/10 p-6 rounded-[2rem] border border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                            lineNumber: 116,
                                            columnNumber: 15
                                        }, this),
                                        " Brand Identity"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4 opacity-70 text-[10px] font-bold uppercase leading-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Founded: 1972"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Origin: Beaverton, Oregon"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                            lineNumber: 120,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Focus: Performance / Lifestyle"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                            lineNumber: 121,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleAutoScroll,
                                    className: `w-full mt-8 py-4 rounded-full border flex items-center justify-center gap-3 transition-all ${isAutoScrolling ? "bg-brand text-white border-brand" : "bg-background border-border"}`,
                                    children: [
                                        isAutoScrolling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                            size: 12,
                                            fill: "currentColor"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                            lineNumber: 130,
                                            columnNumber: 34
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                            size: 12,
                                            fill: "currentColor"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                            lineNumber: 130,
                                            columnNumber: 77
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-black uppercase tracking-widest",
                                            children: "Auto-Scroll"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 px-4 pb-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                mode: "popLayout",
                                children: filteredProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$cards$2f$StoreProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StoreProductCard"], {
                                        product: product
                                    }, product.id, false, {
                                        fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(shop)/brands/[brand]/page.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(BrandClient, "Lxq1cx/OCYUDoUmAooKhD4EWtEQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
_c = BrandClient;
var _c;
__turbopack_context__.k.register(_c, "BrandClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_12b2490c._.js.map