// src/data/store-data.ts

// --- TYPES ---
export type CategorySlug = 'sneakers' | 'watches' | 'cloths' | 'slippers' | 'accessories';
export type Gender = 'men' | 'women' | 'unisex';

// Quality Grades for replica products
export type Quality = 'UA' | 'Semi UA' | 'Master Copy' | '7A' | '5A' | '7AA' | '10A' | 'Standard';

export interface Review {
    userName: string;
    userImage: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: string;
    slug: string;          
    name: string;
    price: number;
    ogPrice: number;
    category: CategorySlug;
    brand: string;
    gender: Gender;
    quality: Quality;
    size?: string;
    color?: string;
    material?: string;
    description: string;   
    promoImage: string;     
    liveImages: string[];  
    videoUrl: string;       
    stock: number;   
    staticNumber : number;        
    isSale?: boolean;
    popularityScore: number;
    salesCount: number;
    discount: number;
    reviews: Review[];     
}

export interface FilterDefinition {
    id: keyof Product | 'priceRange';
    label: string;
    options: string[];
}

// --- MOCK DATA (Restoring ALL old products with NEW logic added) ---
export const MOCK_PRODUCTS: Product[] = [
    // --- SNEAKERS ---
    {
        id: 's1', slug: 'kobe-iii-protro-white', name: 'Kobe III Protro', price: 2499, ogPrice: 9999, category: 'sneakers', brand: 'Nike',
        gender: 'unisex', size: 'EU 42', color: 'White', quality: 'UA', stock: 15, staticNumber : 3,
        description: 'The Kobe III Protro scales back the weight while maintaining the iconic silhouette. Engineered for performance.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fbeaf128-4abc-44ff-8fae-08a6dd8b1852/KOBE+III+PROTRO.png',
        liveImages: [
            'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTyPiwCw81Am4QRb1ErRMSIok8zWovJPXd6H7HtCZCvmCXutALe4Y4SOKA9izLJ4EcFWkQ7Raw5lXWlMISpQNT5PGLhK_qLgyyj3BXT406EjOC-6h4TwlPFXAQ',
            'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQOMtpWEr9ToxBB8gyiEr9IH3oI5dSFVgmY7TNdiuYxc-kO7-78-5ku3NqP67XHudhGF47w41Lx3WX4sXQQdJpjg7SLned6FZObzxYiMiZLQ4ICJLaPsyytcQ',
            'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRp43J2ZXKH0dSP33mGk4o4zxaU_eP6zMv-bD-jKBVnOuHwPf1fyK1fM5LWymySiIqDRUHxNTwPWdDgbv5p5oufIOgU40oRdDFvmDr9q0GJjXVCSfQx0F630dF2',
            'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRlCVLe5kdbj7PXSxElAsN4kYVP0k80fCfeEtkKsK64GyRdNoljDRQ5uZLa3yLG_Xll2VUbl0ogsM87fPjcuAqAKgdtjhdR_Q',
            'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTZ2gmN7Sr6sAfRN32cVfzoxTsEeW_SlFOJGIx1yP-GrU4kMjmmO0TUS4PnDf7yBBPZ0Gp51McGzsE8O7ySgEljugB0XxDf'
        ],
        videoUrl: 'nsWzL9PFB8k', popularityScore: 95, salesCount: 120, discount: 10,
        reviews: [{ userName: "Arjun S.", userImage: "https://i.pravatar.cc/150?u=1", rating: 5, comment: "Insane quality.", date: "2 days ago" }]
    },
    
    {
        id: 's2', slug: 'sb-dunk-low-pro-black', name: 'SB Dunk Low Pro', price: 9200, ogPrice: 9999, category: 'sneakers', brand: 'Nike',
        gender: 'men', size: 'EU 44', color: 'Black', quality: 'Semi UA', stock: 8, staticNumber : 2,
        description: 'Classic skating silhouette in a stealthy black finish. Semi UA grade ensures high-quality materials.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png',
        liveImages: ['https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=800'],
        videoUrl: 'qi7IM5UshIo', popularityScore: 88, salesCount: 200, discount: 5, reviews: []
    },
    {
        id: 's3', slug: 'air-jordan-1-low-qs-red', name: 'Air Jordan 1 Low', price: 9999, ogPrice: 9999, category: 'sneakers', brand: 'Jordan',
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true, stock: 0, staticNumber : 4,
        description: 'The classic AJ1 silhouette in a low-cut profile. UA grade leather and detailing.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2be76228-ff51-4c87-b120-e7be37db4d2e/AIR+FORCE+1+LOW+QS.png',
        liveImages: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800'],
        videoUrl: 'dQw4w9WgXcQ', popularityScore: 99, salesCount: 350, discount: 25, reviews: []
    },
    // Adding duplicates from your old list as unique slugs
    {
        id: 's4', slug: 'zoom-gp-challenge-prm', name: 'Zoom GP Challenge 1.5', price: 9999, ogPrice: 9999, category: 'sneakers', brand: 'Jordan',
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true, stock: 10, staticNumber : 3, description: 'Premium sports performance.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85f69d4c-7a54-4e31-be57-d8896a73f341/W+ZOOM+GP+CHALLENGE+1.5+HC+PRM.png',
        liveImages: [], videoUrl: 'dQw4w9WgXcQ', popularityScore: 99, salesCount: 350, discount: 25, reviews: []
    },
    {
        id: 's5', slug: 'zoom-gp-challenge-pro', name: 'Zoom GP Challenge Pro', price: 9999, ogPrice: 9999, category: 'sneakers', brand: 'Jordan',
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true, stock: 10, staticNumber : 2, description: 'Pro level court control.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
        liveImages: [], videoUrl: 'dQw4w9WgXcQ', popularityScore: 99, salesCount: 350, discount: 25, reviews: []
    },
    {
        id: 's6', slug: 'air-force-1-mini-jewel', name: 'AF1 Mini Jewel', price: 9999, ogPrice: 9999, category: 'sneakers', brand: 'Jordan',
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true, stock: 10, staticNumber : 5, description: 'Elegant mini jewel detailing.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0fcbdc68-279b-4e41-bd31-ea3879164798/W+AIR+FORCE+1+%2707+MINI+JEWEL.png',
        liveImages: [], videoUrl: 'dQw4w9WgXcQ', popularityScore: 99, salesCount: 350, discount: 25, reviews: []
    },
    {
        id: 's7', slug: 'air-force-1-07-classic', name: 'Air Force 1 \'07', price: 9999, ogPrice: 9999, category: 'sneakers', brand: 'Jordan',
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true, stock: 10, staticNumber : 7, description: 'The original 1982 classic.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/fc4622c4-2769-4665-aa6e-42c974a7705e/AIR+FORCE+1+%2707.png',
        liveImages: [], videoUrl: 'dQw4w9WgXcQ', popularityScore: 99, salesCount: 350, discount: 25, reviews: []
    },
    {
        id: 's8', slug: 'air-force-1-07-prm', name: 'Air Force 1 \'07 PRM', price: 9999, ogPrice: 9999, category: 'sneakers', brand: 'Jordan',
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true, stock: 10, staticNumber : 4, description: 'Premium material construction.',
        promoImage: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d217b510-81ac-429c-9881-8103c306e210/W+AIR+FORCE+1+%2707+PRM.png',
        liveImages: [], videoUrl: 'dQw4w9WgXcQ', popularityScore: 99, salesCount: 350, discount: 25, reviews: []
    },

    // --- WATCHES ---
    {
        id: 'w1', slug: 'automatic-diver-silver', name: 'Automatic Diver', price: 9500, ogPrice: 9999, category: 'watches', brand: 'Seiko',
        gender: 'men', size: '40mm', material: 'Steel', color: 'Silver', quality: '7AA', stock: 5, staticNumber : 3,
        description: '7AA Grade automatic movement. Solid stainless steel construction.',
        promoImage: 'https://www.swisstimehouse.com/199560-home_default/titan-90217sl02.jpg',
        liveImages: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a11?auto=format&fit=crop&w=800'],
        videoUrl: 'M7lc1UVf-VE', popularityScore: 75, salesCount: 45, discount: 15, reviews: []
    },
    {
        id: 'w2', slug: 'g-shock-carbon-black', name: 'G-Shock Carbon', price: 6800, ogPrice: 9999, category: 'watches', brand: 'Casio',
        gender: 'unisex', size: '42mm', material: 'Resin', color: 'Black', quality: '10A', stock: 20, staticNumber : 5,
        description: 'Indestructible G-Shock carbon core technology.',
        promoImage: "https://www.swisstimehouse.com/199552-home_default/titan-90217ql01.jpg",
        liveImages: [], videoUrl: 'dQw4w9WgXcQ', popularityScore: 92, salesCount: 150, discount: 0, reviews: []
    },

    // --- CLOTHES ---
    {
        id: 'c1', slug: 'zara-oversized-cotton-tee', name: 'Oversized Cotton Tee', price: 1200, ogPrice: 9999, category: 'cloths', brand: 'Zara',
        gender: 'unisex', material: 'Cotton', color: 'White', quality: 'Standard', stock: 50, staticNumber : 7,
        description: 'Premium heavyweight cotton tee with a modern oversized fit.',
        promoImage: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20240313/pglM/65f0d70f05ac7d77bbaf22ed/-473Wx593H-467162483-multi-MODEL.jpg',
        liveImages: [], videoUrl: 'dQw4w9WgXcQ', popularityScore: 80, salesCount: 500, discount: 20, reviews: []
    }
];

// --- CATEGORY-SPECIFIC FILTERS (Restoring ALL old options) ---
export const CATEGORY_FILTERS: Record<CategorySlug, FilterDefinition[]> = {
    sneakers: [
        { id: 'brand', label: 'Brand', options: ["Nike", "Adidas", "Puma", "Jordan", "Yeezy", "New Balance", "Vans", "Asics", "Converse", "Reebok", "Fila", "Skechers", "Onitsuka Tiger", "Balenciaga", "Gucci", "Louis Vuitton", "Off-White", "Palm Angels", "Birkenstock", "Crocs"] },
        { id: 'quality', label: 'Quality Grade', options: ['UA', 'Semi UA', 'Master Copy', '7A', 'Standard'] },
        { id: 'size', label: 'Size', options: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'] },
        { id: 'color', label: 'Color', options: ['Black', 'White', 'Blue', 'Red', 'Grey'] },
    ],
    watches: [
        { id: 'brand', label: 'Brand', options: ["Rolex", "Seiko", "Casio", "G-SHOCK", "Tissot", "Titan", "Fastrack", "Fossil", "Citizen", "Rado", "Omega", "Tag Heuer", "Hublot", "Patek Philippe", "Audemars Piguet", "Vacheron Constantin", "Cartier", "Emporio Armani", "Giorgio Armani", "Armani Exchange", "Montblanc"] },
        { id: 'quality', label: 'Quality Grade', options: ['7AA', '10A', '7A', '5A', 'Master Copy'] },
        { id: 'material', label: 'Material', options: ['Steel', 'Leather', 'Resin', 'Silicone'] },
        { id: 'color', label: 'Color', options: ['Gold', 'Silver', 'Black', 'Grey'] },
    ],
    cloths: [
        { id: 'brand', label: 'Brand', options: ["Zara", "H&M", "Louis Vuitton", "Gucci", "Prada", "Palm Angels", "Balenciaga", "Burberry", "Calvin Klein", "Dolce & Gabbana", "Emporio Armani", "Giorgio Armani", "Armani Exchange", "Givenchy", "Fendi", "Versace", "Hermès", "Off-White", "Amiri", "Balmain", "Ralph Lauren", "Tom Ford", "Supreme", "Stüssy", "Nike", "Adidas", "Puma", "Fila"] },
        { id: 'quality', label: 'Quality Grade', options: ['Master Copy', '7A', 'Standard'] },
        { id: 'size', label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
        { id: 'color', label: 'Color', options: ['Black', 'White', 'Blue', 'Grey', 'Green', 'Red'] },
    ],
    slippers: [
        { id: 'brand', label: 'Brand', options: ["Nike", "Adidas", "Puma", "Yeezy", "Crocs", "Birkenstock", "Fila", "Skechers", "H&M", "Zara", "Gucci", "Louis Vuitton", "Prada", "Balenciaga", "Versace"] },
        { id: 'quality', label: 'Quality Grade', options: ['UA', '7A', 'Standard'] },
        { id: 'color', label: 'Color', options: ['Black', 'White', 'Blue', 'Brown'] },
    ],
    accessories: [
        { id: 'brand', label: 'Brand', options: ["Ray-Ban", "Oakley", "Gucci", "Fossil", "Casio", "Apple", "Louis Vuitton", "Prada", "Hermès", "Burberry", "Calvin Klein", "Emporio Armani", "Armani Exchange", "Montblanc", "Versace", "Dior", "Chanel", "Balenciaga", "Off-White", "Supreme", "G-SHOCK", "Samsung", "Bose", "Marshall"] },
        { id: 'quality', label: 'Quality Grade', options: ['Master Copy', '7A', 'Standard'] },
        { id: 'color', label: 'Color', options: ['Black', 'Gold', 'Silver', 'Brown'] },
    ],
};

// --- DATA FETCHING HELPERS ---
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    return MOCK_PRODUCTS.find(p => p.slug === slug);
}

export async function getSimilarProducts(category: CategorySlug): Promise<Product[]> {
    return MOCK_PRODUCTS.filter(p => p.category === category).slice(0, 4);
}

// --- FILTER LOGIC (Strictly Preserved) ---
export function filterProducts(products: Product[], activeFilters: Record<string, string[]>) {
    return products.filter(product => {
        for (const [filterKey, selectedOptions] of Object.entries(activeFilters)) {
            if (!selectedOptions || selectedOptions.length === 0) continue;

            if (filterKey === 'priceRange') {
                const rangeString = selectedOptions[0];
                if (!rangeString) continue;
                const [min, max] = rangeString.split('-').map(Number);
                if (product.price < min || product.price > max) return false;
                continue;
            }

            const productValue = (product as any)[filterKey];
            if (productValue === undefined || productValue === null) return false;

            const normalizedProductValue = productValue.toString().toLowerCase();
            const matches = selectedOptions.some(
                option => option.toLowerCase() === normalizedProductValue
            );

            if (!matches) return false;
        }
        return true;
    });
}