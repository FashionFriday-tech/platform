// --- TYPES ---
export type CategorySlug = 'sneakers' | 'watches' | 'cloths' | 'slippers' | 'accessories';
export type Gender = 'men' | 'women' | 'unisex';

// Quality Grades for replica products
export type Quality = 'UA' | 'Semi UA' | 'Master Copy' | '7A' | '5A' | '7AA' | '10A' | 'Standard';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: CategorySlug;
    brand: string;
    gender: Gender;
    quality: Quality; // Added Quality Grade
    size?: string;
    color?: string;
    material?: string;
    image: string;
    isSale?: boolean;
    popularityScore: number; // For "Most Popular" sorting
    salesCount: number;      // For "Best Sellers" sorting
    discount: number;        // For "Highest Discount" sorting
}

export interface FilterDefinition {
    id: keyof Product | 'priceRange';
    label: string;
    options: string[];
}


// --- MOCK DATA ---
export const MOCK_PRODUCTS: Product[] = [
    // SNEAKERS
    { 
        id: 's1', name: 'Kobe III Protro', price: 8500, category: 'sneakers', brand: 'Nike', 
        gender: 'unisex', size: 'EU 42', color: 'White', quality: 'UA', 
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fbeaf128-4abc-44ff-8fae-08a6dd8b1852/KOBE+III+PROTRO.png',
        popularityScore: 95, salesCount: 120, discount: 10
    },
    { 
        id: 's2', name: 'SB Dunk Low Pro', price: 9200, category: 'sneakers', brand: 'Nike', 
        gender: 'men', size: 'EU 44', color: 'Black', quality: 'Semi UA', 
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png',
        popularityScore: 88, salesCount: 200, discount: 5
    },
    { 
        id: 's3', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2be76228-ff51-4c87-b120-e7be37db4d2e/AIR+FORCE+1+LOW+QS.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's4', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85f69d4c-7a54-4e31-be57-d8896a73f341/W+ZOOM+GP+CHALLENGE+1.5+HC+PRM.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's5', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's6', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0fcbdc68-279b-4e41-bd31-ea3879164798/W+AIR+FORCE+1+%2707+MINI+JEWEL.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's7', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/fc4622c4-2769-4665-aa6e-42c974a7705e/AIR+FORCE+1+%2707.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's8', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d217b510-81ac-429c-9881-8103c306e210/W+AIR+FORCE+1+%2707+PRM.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },

     { 
        id: 's9', name: 'Kobe III Protro', price: 8500, category: 'sneakers', brand: 'Nike', 
        gender: 'unisex', size: 'EU 42', color: 'White', quality: 'UA', 
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fbeaf128-4abc-44ff-8fae-08a6dd8b1852/KOBE+III+PROTRO.png',
        popularityScore: 95, salesCount: 120, discount: 10
    },
    { 
        id: 's10', name: 'SB Dunk Low Pro', price: 9200, category: 'sneakers', brand: 'Nike', 
        gender: 'men', size: 'EU 44', color: 'Black', quality: 'Semi UA', 
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png',
        popularityScore: 88, salesCount: 200, discount: 5
    },
    { 
        id: 's11', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2be76228-ff51-4c87-b120-e7be37db4d2e/AIR+FORCE+1+LOW+QS.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's12', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85f69d4c-7a54-4e31-be57-d8896a73f341/W+ZOOM+GP+CHALLENGE+1.5+HC+PRM.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's15', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's16', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0fcbdc68-279b-4e41-bd31-ea3879164798/W+AIR+FORCE+1+%2707+MINI+JEWEL.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's17', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/fc4622c4-2769-4665-aa6e-42c974a7705e/AIR+FORCE+1+%2707.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },
     { 
        id: 's18', name: 'Air Jordan 1 Low', price: 9999, category: 'sneakers', brand: 'Jordan', 
        gender: 'men', size: 'EU 42', color: 'Red', quality: 'UA', isSale: true,
        image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d217b510-81ac-429c-9881-8103c306e210/W+AIR+FORCE+1+%2707+PRM.png',
        popularityScore: 99, salesCount: 350, discount: 25
    },

    // WATCHES
    { 
        id: 'w1', name: 'Automatic Diver', price: 9500, category: 'watches', brand: 'Seiko', 
        gender: 'men', size: '40mm', material: 'Steel', color: 'Silver', quality: '7AA', 
        image: 'https://www.swisstimehouse.com/199560-home_default/titan-90217sl02.jpg',
        popularityScore: 75, salesCount: 45, discount: 15
    },
    { 
        id: 'w2', name: 'G-Shock Carbon', price: 6800, category: 'watches', brand: 'Casio', 
        gender: 'unisex', size: '42mm', material: 'Resin', color: 'Black', quality: '10A', 
        image: "https://www.swisstimehouse.com/199552-home_default/titan-90217ql01.jpg",
        popularityScore: 92, salesCount: 150, discount: 0
    },

    // CLOTHES
    { 
        id: 'c1', name: 'Oversized Cotton Tee', price: 1200, category: 'cloths', brand: 'Zara', 
        gender: 'unisex', material: 'Cotton', color: 'White', quality: 'Standard', 
        image: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20240313/pglM/65f0d70f05ac7d77bbaf22ed/-473Wx593H-467162483-multi-MODEL.jpg',
        popularityScore: 80, salesCount: 500, discount: 20
    }
];

// --- CATEGORY-SPECIFIC FILTERS ---
export const CATEGORY_FILTERS: Record<CategorySlug, FilterDefinition[]> = {
    sneakers: [
        { id: 'brand', label: 'Brand', options: ['Nike', 'Adidas', 'Puma', 'Jordan', 'Yeezy', 'New Balance', 'Vans', 'Asics',] },
        { id: 'quality', label: 'Quality Grade', options: ['UA', 'Semi UA', 'Master Copy', '7A', 'Standard'] },
        { id: 'size', label: 'Size', options: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'] },
        { id: 'color', label: 'Color', options: ['Black', 'White', 'Blue', 'Red', 'Grey'] },
    ],
    watches: [
        { id: 'brand', label: 'Brand', options: ['Rolex', 'Seiko', 'Casio', 'Patek Philippe', 'Hublot', 'Titan', 'Tissot', 'G-SHOCK'] },
        { id: 'quality', label: 'Quality Grade', options: ['7AA', '10A', '7A', '5A', 'Master Copy'] },
        { id: 'material', label: 'Material', options: ['Steel', 'Leather', 'Resin', 'Silicone'] },
        { id: 'color', label: 'Color', options: ['Gold', 'Silver', 'Black', 'Grey'] },
    ],
    cloths: [
        { id: 'brand', label: 'Brand', options: ['Zara', 'H&M', 'Louis Vuitton', 'Gucci', 'Prada', 'Nike', 'Adidas', 'Palm Angels'] },
        { id: 'quality', label: 'Quality Grade', options: ['Master Copy', '7A', 'Standard'] },
        { id: 'size', label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
        { id: 'color', label: 'Color', options: ['Black', 'White', 'Blue', 'Grey', 'Green', 'Red'] },
    ],
    slippers: [
        { id: 'brand', label: 'Brand', options: ['Nike', 'Adidas', 'Puma', 'Yeezy', 'Crocs', 'Birkenstock'] },
        { id: 'quality', label: 'Quality Grade', options: ['UA', '7A', 'Standard'] },
        { id: 'color', label: 'Color', options: ['Black', 'White', 'Blue', 'Brown'] },
    ],
    accessories: [
        { id: 'brand', label: 'Brand', options: ['Ray-Ban', 'Oakley', 'Gucci', 'Fossil', 'Casio', 'Marshall', 'Apple'] },
        { id: 'quality', label: 'Quality Grade', options: ['Master Copy', '7A', 'Standard'] },
        { id: 'color', label: 'Color', options: ['Black', 'Gold', 'Silver', 'Brown'] },
    ],
};

// --- UPDATED FILTER LOGIC ---
export function filterProducts(products: Product[], activeFilters: Record<string, string[]>) {
    return products.filter(product => {
        for (const [filterKey, selectedOptions] of Object.entries(activeFilters)) {
            // If no filter selected for this key, skip to next filter
            if (!selectedOptions || selectedOptions.length === 0) continue;

            // 1. Handle Price Range Slider (format: "0-10000")
            if (filterKey === 'priceRange') {
                const rangeString = selectedOptions[0];
                if (!rangeString) continue;

                const [min, max] = rangeString.split('-').map(Number);
                if (product.price < min || product.price > max) return false;
                continue;
            }

            // 2. Handle Attribute Filters (Brand, Size, Color, Quality, Material)
            const productValue = (product as any)[filterKey];

            // Hide product if it doesn't have the attribute the user is filtering for
            if (productValue === undefined || productValue === null) return false;

            const normalizedProductValue = productValue.toString().toLowerCase();
            
            // Check if product attribute matches any of the selected options (case-insensitive)
            const matches = selectedOptions.some(
                option => option.toLowerCase() === normalizedProductValue
            );

            if (!matches) return false;
        }
        return true;
    });
}