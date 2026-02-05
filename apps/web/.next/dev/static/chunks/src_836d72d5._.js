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
"[project]/src/app/(shop)/categories/[category]/_components/Client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$28$2e$5_react$40$19$2e$2$2e$1$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/styled-jsx@5.1.6_@babel+core@7.28.5_react@19.2.1/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/store-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/brandLogos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$ri$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.1/node_modules/react-icons/ri/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.2.1/node_modules/react-icons/md/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/SettingsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
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
;
;
;
const SORT_OPTIONS = [
    {
        label: "Newest Arrivals",
        value: "newest"
    },
    {
        label: "Best Sellers",
        value: "most-sold"
    },
    {
        label: "Most Popular",
        value: "most-liked"
    },
    {
        label: "Highest Discount",
        value: "most-offered"
    },
    {
        label: "Price: Low to High",
        value: "price-asc"
    },
    {
        label: "Price: High to Low",
        value: "price-desc"
    }
];
const COLOR_MAP = {
    Black: "#000000",
    White: "#ffffff",
    Blue: "#1d4ed8",
    Grey: "#71717a",
    Red: "#dc2626",
    Green: "#15803d",
    Gold: "#fbbf24"
};
// --- SHARED COMPONENT: FILTER CONTENT ---
function FilterContent({ section, selectedOptions, onChange, maxPriceLimit }) {
    const isBrandSection = section.id === "brand";
    const isPriceSection = section.id === "priceRange";
    const isColorSection = section.id === "color";
    const currentRange = isPriceSection ? (selectedOptions[0] || `0-${maxPriceLimit}`).split("-") : [
        0,
        maxPriceLimit
    ];
    const maxVal = currentRange[1];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pt-2 pb-4",
        children: [
            isPriceSection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-black text-foreground",
                                children: "₹0"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-black text-brand bg-background px-2 py-1 rounded-full uppercase",
                                children: [
                                    "Under ₹",
                                    Number(maxVal).toLocaleString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0",
                        max: maxPriceLimit,
                        step: "100",
                        value: maxVal,
                        onChange: (e)=>onChange(section.id, `0-${e.target.value}`, true),
                        className: "w-full h-1 bg-background-muted rounded-full appearance-none cursor-pointer accent-brand",
                        style: {
                            background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${Number(maxVal) / maxPriceLimit * 100}%, var(--surface-muted) ${Number(maxVal) / maxPriceLimit * 100}%, var(--surface-muted) 100%)`
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, this),
            isColorSection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-3",
                children: section.options.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onChange(section.id, color, false),
                        className: `w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${selectedOptions.includes(color) ? "border-brand scale-110 shadow-lg" : "border-border"}`,
                        style: {
                            backgroundColor: COLOR_MAP[color] || "#ccc"
                        },
                        children: selectedOptions.includes(color) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            size: 16,
                            className: color === "White" ? "text-black" : "text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                            lineNumber: 105,
                            columnNumber: 17
                        }, this)
                    }, color, false, {
                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                        lineNumber: 93,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this),
            !isPriceSection && !isColorSection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: section.options.map((option)=>{
                    const isChecked = selectedOptions.includes(option);
                    const brandObj = isBrandSection ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((b)=>b.name.toLowerCase() === option.toLowerCase()) : null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onChange(section.id, option, false),
                        className: `flex items-center gap-2 px-4 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isChecked ? "bg-foreground text-background border-foreground shadow-xl scale-95" : "bg-background border-border text-foreground hover:border-foreground/40"}`,
                        children: [
                            isBrandSection && brandObj && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: brandObj.link,
                                alt: "",
                                className: `w-5 object-contain transition-all scale-125 ${isChecked ? "brightness-0 invert-0" : "dark:invert"}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                lineNumber: 135,
                                columnNumber: 19
                            }, this),
                            option
                        ]
                    }, option, true, {
                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                        lineNumber: 125,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_c = FilterContent;
function CategoryClient({ category }) {
    _s();
    // 1. DATA PREPARATION
    const products = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CategoryClient.useMemo[products]": ()=>{
            const raw = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PRODUCTS"].filter({
                "CategoryClient.useMemo[products].raw": (p)=>p.category === category
            }["CategoryClient.useMemo[products].raw"]);
            return Array.from(new Map(raw.map({
                "CategoryClient.useMemo[products]": (item)=>[
                        item.id,
                        item
                    ]
            }["CategoryClient.useMemo[products]"])).values());
        }
    }["CategoryClient.useMemo[products]"], [
        category
    ]);
    const maxPriceLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CategoryClient.useMemo[maxPriceLimit]": ()=>{
            if (products.length === 0) return 10000;
            return Math.ceil(Math.max(...products.map({
                "CategoryClient.useMemo[maxPriceLimit]": (p)=>p.price
            }["CategoryClient.useMemo[maxPriceLimit]"])) / 1000) * 1000;
        }
    }["CategoryClient.useMemo[maxPriceLimit]"], [
        products
    ]);
    // 2. STATE
    const [activeDrawer, setActiveDrawer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openSections, setOpenSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        priceRange: true
    });
    const [openSectionId, setOpenSectionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("priceRange");
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("newest");
    const [isAutoScrolling, setIsAutoScrolling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [activeFilters, setActiveFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        priceRange: [
            `0-${maxPriceLimit}`
        ]
    });
    const [stagedFilters, setStagedFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        priceRange: [
            `0-${maxPriceLimit}`
        ]
    });
    const availableFilters = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_FILTERS"][category] || [];
    const allFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CategoryClient.useMemo[allFilters]": ()=>[
                {
                    id: "priceRange",
                    label: "Budget Range",
                    options: []
                },
                ...availableFilters.filter({
                    "CategoryClient.useMemo[allFilters]": (f)=>f.id !== "gender"
                }["CategoryClient.useMemo[allFilters]"])
            ]
    }["CategoryClient.useMemo[allFilters]"], [
        category,
        availableFilters
    ]);
    // 3. AUTO SCROLL ENGINE
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    // Extract speed safely using the correct property name: 'autoScrollLevel'
    const currentScrollSpeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CategoryClient.useMemo[currentScrollSpeed]": ()=>{
            // We use settings?.autoScrollLevel and provide a fallback (3) to avoid indexing errors
            const scrollSpeed = settings?.autoScrollLevel ?? 3;
            return scrollSpeed;
        }
    }["CategoryClient.useMemo[currentScrollSpeed]"], [
        settings?.autoScrollLevel
    ]);
    const stopAutoScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CategoryClient.useCallback[stopAutoScroll]": ()=>{
            setIsAutoScrolling(false);
            if (scrollRef.current) {
                cancelAnimationFrame(scrollRef.current);
                scrollRef.current = null;
            }
        }
    }["CategoryClient.useCallback[stopAutoScroll]"], []);
    const toggleAutoScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CategoryClient.useCallback[toggleAutoScroll]": ()=>{
            if (isAutoScrolling) {
                stopAutoScroll();
                return;
            }
            setIsAutoScrolling(true);
            const scrollStep = {
                "CategoryClient.useCallback[toggleAutoScroll].scrollStep": ()=>{
                    // Smoothly scroll by the mapped factor
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
            }["CategoryClient.useCallback[toggleAutoScroll].scrollStep"];
            scrollRef.current = requestAnimationFrame(scrollStep);
        }
    }["CategoryClient.useCallback[toggleAutoScroll]"], [
        isAutoScrolling,
        currentScrollSpeed,
        stopAutoScroll
    ]);
    // Emergency stop on manual interaction
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CategoryClient.useEffect": ()=>{
            const stopScrolling = {
                "CategoryClient.useEffect.stopScrolling": ()=>{
                    if (isAutoScrolling) {
                        setIsAutoScrolling(false);
                        if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
                        scrollRef.current = null;
                    }
                }
            }["CategoryClient.useEffect.stopScrolling"];
            window.addEventListener("wheel", stopScrolling, {
                passive: true
            });
            window.addEventListener("touchstart", stopScrolling, {
                passive: true
            });
            window.addEventListener("mousedown", stopScrolling, {
                passive: true
            });
            return ({
                "CategoryClient.useEffect": ()=>{
                    window.removeEventListener("wheel", stopScrolling);
                    window.removeEventListener("touchstart", stopScrolling);
                    window.removeEventListener("mousedown", stopScrolling);
                }
            })["CategoryClient.useEffect"];
        }
    }["CategoryClient.useEffect"], [
        isAutoScrolling
    ]);
    // 4. FILTER/SORT LOGIC
    const handleFilterChange = (id, opt, isRange)=>{
        const setter = activeDrawer === "filter" ? setStagedFilters : setActiveFilters;
        setter((prev)=>{
            const cur = prev[id] || [];
            if (isRange) return {
                ...prev,
                [id]: [
                    opt
                ]
            };
            return cur.includes(opt) ? {
                ...prev,
                [id]: cur.filter((i)=>i !== opt)
            } : {
                ...prev,
                [id]: [
                    ...cur,
                    opt
                ]
            };
        });
    };
    const filteredAndSortedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CategoryClient.useMemo[filteredAndSortedProducts]": ()=>{
            let result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$store$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterProducts"])(products, activeFilters);
            const sorted = [
                ...result
            ];
            if (sortBy === "price-asc") sorted.sort({
                "CategoryClient.useMemo[filteredAndSortedProducts]": (a, b)=>a.price - b.price
            }["CategoryClient.useMemo[filteredAndSortedProducts]"]);
            else if (sortBy === "price-desc") sorted.sort({
                "CategoryClient.useMemo[filteredAndSortedProducts]": (a, b)=>b.price - a.price
            }["CategoryClient.useMemo[filteredAndSortedProducts]"]);
            else if (sortBy === "most-sold") sorted.sort({
                "CategoryClient.useMemo[filteredAndSortedProducts]": (a, b)=>(b.salesCount || 0) - (a.salesCount || 0)
            }["CategoryClient.useMemo[filteredAndSortedProducts]"]);
            else if (sortBy === "most-liked") sorted.sort({
                "CategoryClient.useMemo[filteredAndSortedProducts]": (a, b)=>(b.popularityScore || 0) - (a.popularityScore || 0)
            }["CategoryClient.useMemo[filteredAndSortedProducts]"]);
            else if (sortBy === "most-offered") sorted.sort({
                "CategoryClient.useMemo[filteredAndSortedProducts]": (a, b)=>(b.discount || 0) - (a.discount || 0)
            }["CategoryClient.useMemo[filteredAndSortedProducts]"]);
            return sorted;
        }
    }["CategoryClient.useMemo[filteredAndSortedProducts]"], [
        products,
        activeFilters,
        sortBy
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CategoryClient.useEffect": ()=>{
            document.body.style.overflow = activeDrawer ? "hidden" : "unset";
        }
    }["CategoryClient.useEffect"], [
        activeDrawer
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-1eb9c7583649ebf3" + " " + "bg-background min-h-screen text-foreground transition-colors duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-1eb9c7583649ebf3" + " " + "sticky lg:hidden top-16 z-30 bg-background border-y border-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-1eb9c7583649ebf3" + " " + "mx-auto flex h-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setStagedFilters(activeFilters);
                                setActiveDrawer("filter");
                            },
                            className: "jsx-1eb9c7583649ebf3" + " " + "flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border hover:bg-background-muted transition-all outline-none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                    lineNumber: 311,
                                    columnNumber: 13
                                }, this),
                                " Filter"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: toggleAutoScroll,
                            className: "jsx-1eb9c7583649ebf3" + " " + `flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-border transition-all outline-none ${isAutoScrolling ? "text-brand" : ""}`,
                            children: [
                                isAutoScrolling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                    size: 12,
                                    className: "fill-current"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                    lineNumber: 321,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                    size: 12,
                                    className: "fill-current"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                    lineNumber: 323,
                                    columnNumber: 15
                                }, this),
                                isAutoScrolling ? "Scrolling" : "Auto Scroll"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveDrawer("sort"),
                            className: "jsx-1eb9c7583649ebf3" + " " + "flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-background-muted transition-all outline-none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                    lineNumber: 332,
                                    columnNumber: 13
                                }, this),
                                " Sort"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                            lineNumber: 328,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                    lineNumber: 303,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "jsx-1eb9c7583649ebf3" + " " + "container mx-auto flex gap-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-1eb9c7583649ebf3" + " " + "hidden lg:block w-76 shrink-0 sticky top-26 h-[calc(100vh-100px)] overflow-y-auto no-scrollbar border-r border-border pr-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-1eb9c7583649ebf3" + " " + "sticky top-0 z-100 flex justify-between items-center mb-8 bg-background pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-1eb9c7583649ebf3" + " " + "text-xl font-black uppercase italic tracking-tighter",
                                        children: "Refine"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveFilters({
                                                priceRange: [
                                                    `0-${maxPriceLimit}`
                                                ]
                                            }),
                                        className: "jsx-1eb9c7583649ebf3" + " " + "text-[10px] font-bold opacity-40 hover:opacity-100 uppercase tracking-widest transition-opacity",
                                        children: "Reset"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-1eb9c7583649ebf3" + " " + "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: toggleAutoScroll,
                                        className: "jsx-1eb9c7583649ebf3" + " " + `w-full py-3.5 rounded-4xl flex items-center justify-center gap-3 transition-all duration-500 border ${isAutoScrolling ? "bg-brand text-brand-foreground border-brand" : "bg-background border-border"}`,
                                        children: [
                                            isAutoScrolling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                                size: 14,
                                                fill: "currentColor"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                lineNumber: 364,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 14,
                                                fill: "currentColor"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                lineNumber: 366,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-1eb9c7583649ebf3" + " " + "text-[11px] font-black uppercase tracking-widest",
                                                children: isAutoScrolling ? "Stop" : "Start Auto-Scroll"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                lineNumber: 368,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this),
                                    allFilters.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-1eb9c7583649ebf3" + " " + "border-b border-border py-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setOpenSections((prev)=>({
                                                                ...prev,
                                                                [section.id]: !prev[section.id]
                                                            })),
                                                    className: "jsx-1eb9c7583649ebf3" + " " + "flex w-full items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] py-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-1eb9c7583649ebf3",
                                                            children: section.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 384,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: `w-4 h-4 transition-transform duration-500 ${openSections[section.id] ? "rotate-180" : ""}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 385,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                    lineNumber: 375,
                                                    columnNumber: 17
                                                }, this),
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
                                                        className: "overflow-hidden",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterContent, {
                                                            section: section,
                                                            selectedOptions: activeFilters[section.id] || [],
                                                            onChange: handleFilterChange,
                                                            maxPriceLimit: maxPriceLimit
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                        lineNumber: 393,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, section.id, true, {
                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                            lineNumber: 374,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-1eb9c7583649ebf3" + " " + "flex-1 px-4 pt-8 pb-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-1eb9c7583649ebf3" + " " + "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-8 lg:pt-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    mode: "popLayout",
                                    children: filteredAndSortedProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
                                                        className: "jsx-1eb9c7583649ebf3" + " " + "aspect-4/5 overflow-hidden rounded-4xl lg:rounded-[2.5rem] bg-background-muted relative",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: product.promoImage || "/images/placeholder.png",
                                                            alt: product.name,
                                                            className: "jsx-1eb9c7583649ebf3" + " " + "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-1eb9c7583649ebf3" + " " + "mt-4 px-1 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-1eb9c7583649ebf3" + " " + "flex justify-between items-center mb-0.5 text-[8px] md:text-[10px]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-1eb9c7583649ebf3" + " " + "font-black text-foreground-subtle uppercase tracking-widest",
                                                                    children: product.brand
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                    lineNumber: 437,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-1eb9c7583649ebf3" + " " + "flex gap-1 justify-center items-center font-bold border border-border px-1.5 py-0.5 rounded-full text-foreground-subtle uppercase",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$ri$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RiShieldStarFill"], {}, void 0, false, {
                                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                            lineNumber: 441,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " ",
                                                                        product.quality
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                    lineNumber: 440,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 436,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "jsx-1eb9c7583649ebf3" + " " + "text-[14px] font-bold uppercase truncate tracking-tight text-foreground",
                                                            children: product.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 444,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-1eb9c7583649ebf3" + " " + "flex items-center gap-2 text-[11px]",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-1eb9c7583649ebf3" + " " + "flex justify-between items-center w-full",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-1eb9c7583649ebf3" + " " + "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-1eb9c7583649ebf3" + " " + " font-medium text-foreground/60 line-through",
                                                                                children: "₹14999"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                                lineNumber: 451,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-1eb9c7583649ebf3" + " " + "font-black text-foreground",
                                                                                children: [
                                                                                    "₹",
                                                                                    product.price.toLocaleString()
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                                lineNumber: 456,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                        lineNumber: 450,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-1eb9c7583649ebf3" + " " + "flex items-center gap-1 text-foreground-muted text-[10px]",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdStars"], {}, void 0, false, {
                                                                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                                lineNumber: 461,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            " 4.5"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                        lineNumber: 460,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                lineNumber: 449,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 447,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, product.id, true, {
                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                            lineNumber: 418,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                    lineNumber: 416,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                lineNumber: 415,
                                columnNumber: 11
                            }, this),
                            filteredAndSortedProducts.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-1eb9c7583649ebf3" + " " + "py-24 text-center w-full opacity-40 text-[10px] font-black uppercase tracking-widest",
                                children: "No matching items"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                lineNumber: 471,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                        lineNumber: 414,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                lineNumber: 337,
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
                            className: "fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                            lineNumber: 482,
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
                                type: "tween",
                                duration: 0.4,
                                ease: [
                                    0.32,
                                    0.72,
                                    0,
                                    1
                                ]
                            },
                            drag: "y",
                            dragConstraints: {
                                top: 0,
                                bottom: 0
                            },
                            dragElastic: {
                                top: 0,
                                bottom: 0.8
                            },
                            onDragEnd: (_, info)=>{
                                if (info.offset.y > 50 || info.velocity.y > 400) setActiveDrawer(null);
                            },
                            className: "fixed bottom-0 left-0 right-0 z-[70] bg-background-elevated border-t border-border rounded-t-[2.5rem] max-h-[85vh] flex flex-col shadow-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-1eb9c7583649ebf3" + " " + "w-full flex justify-center py-5 shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-1eb9c7583649ebf3" + " " + "w-12 h-1 bg-border rounded-full opacity-30"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                        lineNumber: 508,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                    lineNumber: 507,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-1eb9c7583649ebf3" + " " + "px-8 overflow-y-auto no-scrollbar",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "jsx-1eb9c7583649ebf3" + " " + "text-[10px] font-black uppercase tracking-[0.2em] mb-6 sticky top-0 bg-background-elevated py-4 z-10 text-foreground-subtle border-b border-border/10",
                                            children: activeDrawer === "filter" ? "REFINE" : "SORT"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                            lineNumber: 511,
                                            columnNumber: 17
                                        }, this),
                                        activeDrawer === "sort" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-1eb9c7583649ebf3" + " " + "space-y-1",
                                            children: SORT_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    onClick: ()=>{
                                                        setSortBy(opt.value);
                                                        setActiveDrawer(null);
                                                    },
                                                    className: "jsx-1eb9c7583649ebf3" + " " + "w-full flex items-center justify-between py-5 border-b border-border last:border-none cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-1eb9c7583649ebf3" + " " + `text-[11px] uppercase tracking-widest ${sortBy === opt.value ? "font-black text-brand" : "font-bold text-foreground-subtle"}`,
                                                            children: opt.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 526,
                                                            columnNumber: 25
                                                        }, this),
                                                        sortBy === opt.value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-1eb9c7583649ebf3" + " " + "w-2 h-2 bg-brand rounded-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 536,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, opt.value, true, {
                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                            lineNumber: 516,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-1eb9c7583649ebf3" + " " + "space-y-2",
                                                    children: allFilters.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-1eb9c7583649ebf3" + " " + "border-b border-border py-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setOpenSectionId(openSectionId === section.id ? null : section.id),
                                                                    className: "jsx-1eb9c7583649ebf3" + " " + "flex w-full items-center justify-between text-[11px] font-black uppercase tracking-[0.15em] py-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-1eb9c7583649ebf3",
                                                                            children: section.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                            lineNumber: 557,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                            className: `w-3.5 h-3.5 transition-transform ${openSectionId === section.id ? "rotate-180" : ""}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                            lineNumber: 558,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                    lineNumber: 549,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                                                    children: openSectionId === section.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
                                                                        className: "overflow-hidden",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterContent, {
                                                                            section: section,
                                                                            selectedOptions: stagedFilters[section.id] || [],
                                                                            onChange: handleFilterChange,
                                                                            maxPriceLimit: maxPriceLimit
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                            lineNumber: 572,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                        lineNumber: 566,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                                    lineNumber: 564,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, section.id, true, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 545,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-1eb9c7583649ebf3" + " " + "grid grid-cols-2 gap-4 sticky bottom-0 pb-4 bg-background-elevated pt-6 border-t border-border/10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setStagedFilters({
                                                                    priceRange: [
                                                                        `0-${maxPriceLimit}`
                                                                    ]
                                                                }),
                                                            className: "jsx-1eb9c7583649ebf3" + " " + "py-4 text-[10px] font-black uppercase tracking-widest text-foreground-subtle",
                                                            children: "Reset"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 587,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setActiveFilters(stagedFilters);
                                                                setActiveDrawer(null);
                                                            },
                                                            className: "jsx-1eb9c7583649ebf3" + " " + "py-4 bg-brand text-brand-foreground rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl",
                                                            children: "Apply"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                            lineNumber: 597,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                                    lineNumber: 510,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                            lineNumber: 489,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
                lineNumber: 479,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$28$2e$5_react$40$19$2e$2$2e$1$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "1eb9c7583649ebf3",
                children: "input[type=range].jsx-1eb9c7583649ebf3::-webkit-slider-thumb{appearance:none;border:4px solid var(--brand-primary);cursor:pointer;background:#fff;border-radius:50%;width:18px;height:18px;box-shadow:0 4px 12px #00000026}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(shop)/categories/[category]/_components/Client.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
_s(CategoryClient, "TPf2hOlxGD1ywnmXC+yD5dxPXNw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
_c1 = CategoryClient;
var _c, _c1;
__turbopack_context__.k.register(_c, "FilterContent");
__turbopack_context__.k.register(_c1, "CategoryClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_836d72d5._.js.map