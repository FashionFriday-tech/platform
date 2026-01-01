// --- TYPES ---
export type CategorySlug = 'sneakers' | 'watches' | 'cloths' | 'slippers' | 'accessories';
export type Gender = 'men' | 'women' | 'unisex';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: CategorySlug;
    brand: string;
    gender: Gender;
    size?: string;
    color?: string;
    material?: string;
    image: string;
}

export interface FilterDefinition {
    id: keyof Product | 'priceRange';
    label: string;
    options: string[];
}


// --- MOCK DATA ---

export const MOCK_PRODUCTS: Product[] = [
    // Sneakers
    { id: 's1', name: 'Minimalist Low Top', price: 1500, category: 'sneakers', brand: 'Common Projects', gender: 'unisex', size: 'EU 42', color: 'White', image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fbeaf128-4abc-44ff-8fae-08a6dd8b1852/KOBE+III+PROTRO.png' },
    { id: 's2', name: 'Runner Tech', price: 2200, category: 'sneakers', brand: 'Nike', gender: 'men', size: 'EU 44', color: 'Black', image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png' },
    { id: 's3', name: 'Retro Court', price: 950, category: 'sneakers', brand: 'Adidas', gender: 'women', size: 'EU 38', color: 'White/Black', image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/9ba72e85-7bb7-4bf4-b18a-baa97254c06a/SABRINA+3+MVM+EP.png' },
    { id: 's3', name: 'Retro Court', price: 950, category: 'sneakers', brand: 'Adidas', gender: 'women', size: 'EU 38', color: 'White/Black', image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/ba7b0d9f-c266-48bf-9021-f75682197506/NIKE+GATO.png' },
    { id: 's3', name: 'Retro Court', price: 950, category: 'sneakers', brand: 'Adidas', gender: 'women', size: 'EU 38', color: 'White/Black', image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2be76228-ff51-4c87-b120-e7be37db4d2e/AIR+FORCE+1+LOW+QS.png' },
    { id: 's3', name: 'Retro Court', price: 950, category: 'sneakers', brand: 'Adidas', gender: 'women', size: 'EU 38', color: 'White/Black', image: '' },

    { id: 'w1', name: 'Classic Automatic', price: 450, category: 'watches', brand: 'Seiko', gender: 'men', size: '40mm', material: 'Steel', image: 'https://www.swisstimehouse.com/199560-home_default/titan-90217sl02.jpg' },
    { id: 'w2', name: 'Minimalist Leather', price: 120, category: 'watches', brand: 'Daniel Wellington', gender: 'women', size: '32mm', material: 'Leather', image: "https://www.swisstimehouse.com/199552-home_default/titan-90217ql01.jpg" },
    { id: 'w1', name: 'Classic Automatic', price: 450, category: 'watches', brand: 'Seiko', gender: 'men', size: '40mm', material: 'Steel', image: '' },
    { id: 'w2', name: 'Minimalist Leather', price: 120, category: 'watches', brand: 'Daniel Wellington', gender: 'women', size: '32mm', material: 'Leather', image: "" },

    { id: 'a1', name: 'Slim Cardholder', price: 850, category: 'slippers', brand: 'Bellroy', gender: 'unisex', material: 'Leather', color: 'Black', image: 'https://img.tatacliq.com/images/i24//437Wx649H/MP000000026707839_437Wx649H_202505221146041.jpeg' },
    { id: 'a2', name: 'Geometric Sunglasses', price: 1800, category: 'slippers', brand: 'Ray-Ban', gender: 'unisex', material: 'Acetate', color: 'Black', image: 'https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyprod/t.resize(w:700,dpr:1)/products/pictures/item/free/original/superdry/MF310134A02A/0/6YZW7sq5Rz-410277749008_1.jpg'},

    { id: 'c1', name: 'Slim Cardholder', price: 850, category: 'cloths', brand: 'Bellroy', gender: 'unisex', material: 'Leather', color: 'Black', image: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20240313/pglM/65f0d70f05ac7d77bbaf22ed/-473Wx593H-467162483-multi-MODEL.jpg' },
    { id: 'c2', name: 'Geometric Sunglasses', price: 1800, category: 'cloths', brand: 'Ray-Ban', gender: 'unisex', material: 'Acetate', color: 'Black', image: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20250320/HTna/67dbbd0055340d4b4f7ab106/-473Wx593H-700319495-black-MODEL.jpg' },
    { id: 'c3', name: 'Slim Cardholder', price: 850, category: 'cloths', brand: 'Bellroy', gender: 'unisex', material: 'Leather', color: 'Black', image: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20241219/E650/67643ce9c148fa1b304e7ea6/-473Wx593H-700951356-black-MODEL.jpg' },
    { id: 'c4', name: 'Slim Cardholder', price: 850, category: 'cloths', brand: 'Bellroy', gender: 'unisex', material: 'Leather', color: 'Black', image: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20250226/Xhyf/67be97fe59f8353980f81687/-473Wx593H-701268892-blue-MODEL.jpg' },
    { id: 'c5', name: 'Slim Cardholder', price: 850, category: 'cloths', brand: 'Bellroy', gender: 'unisex', material: 'Leather', color: 'Black', image: 'https://assets-jiocdn.ajio.com/medias/sys_master/root/20250226/6qCz/67be980459f8353980f81752/-473Wx593H-701268892-black-MODEL.jpg' },
    { id: 'c6', name: 'Slim Cardholder', price: 850, category: 'cloths', brand: 'Bellroy', gender: 'unisex', material: 'Leather', color: 'Black', image: '' },


    // Accessories
    { id: 'a1', name: 'Slim Cardholder', price: 850, category: 'accessories', brand: 'Bellroy', gender: 'unisex', material: 'Leather', color: 'Black', image: 'https://image.hm.com/assets/hm/cc/06/cc06a265e6ee89897c59ddaedc471ada6533d4ac.jpg?imwidth=2160' },
    { id: 'a2', name: 'Geometric Sunglasses', price: 1800, category: 'accessories', brand: 'Ray-Ban', gender: 'unisex', material: 'Acetate', color: 'Black', image: 'https://image.hm.com/assets/hm/3d/59/3d59317d5c9b9dfe5e659202c6a886733d5e79dc.jpg?imwidth=2160' },
    { id: 'a3', name: 'Retro Court', price: 950, category: 'accessories', brand: 'Adidas', gender: 'women', size: 'EU 38', color: 'White/Black', image: 'https://image.hm.com/assets/hm/f5/24/f52437e0575e0ab96ef1c88d2ec5023fee613e77.jpg?imwidth=2160' },
    { id: 'a4', name: 'Retro Court', price: 950, category: 'accessories', brand: 'Adidas', gender: 'women', size: 'EU 38', color: 'White/Black', image: 'https://image.hm.com/assets/hm/83/29/832977cb18b910b53930690813a274588c2e8aa5.jpg?imwidth=2160' },
    { id: 'a5', name: 'Retro Court', price: 950, category: 'accessories', brand: 'Adidas', gender: 'women', size: 'EU 38', color: 'White/Black', image: 'https://image.hm.com/assets/hm/29/26/29267626b430b82687ee9f2002084dded0992dab.jpg?imwidth=2160' },
    { id: 'a6', name: 'Retro Court', price: 950, category: 'accessories', brand: 'Adidas', gender: 'women', size: 'EU 38', color: 'White/Black', image: '' },


];


// --- DYNAMIC FILTER DEFINITIONS ---

const commonFilters: FilterDefinition[] = [
    { id: 'gender', label: 'Gender', options: ['Men', 'Women', 'Unisex'] },
    { id: 'priceRange', label: 'Price', options: ['Under $100', '$100 - $200', '$200+'] },
];

export const CATEGORY_FILTERS: Record<CategorySlug, FilterDefinition[]> = {
    sneakers: [
        ...commonFilters,
        { id: 'brand', label: 'Brand', options: ['Common Projects', 'Nike', 'Adidas'] },
        { id: 'size', label: 'Size', options: ['EU 38', 'EU 42', 'EU 44'] },
        { id: 'color', label: 'Color', options: ['White', 'Black', 'White/Black'] },
    ],
    watches: [
        ...commonFilters,
        { id: 'brand', label: 'Brand', options: ['Seiko', 'Daniel Wellington'] },
        { id: 'size', label: 'Case Size', options: ['32mm', '40mm'] }, // Note: different sizes than shoes
        { id: 'material', label: 'Band Material', options: ['Steel', 'Leather'] },
    ],
    cloths: [
        ...commonFilters,
        { id: 'brand', label: 'Brand', options: ['Common Projects', 'Nike', 'Adidas'] },
        { id: 'size', label: 'Size', options: ['EU 38', 'EU 42', 'EU 44'] },
        { id: 'color', label: 'Color', options: ['White', 'Black', 'White/Black'] },
    ],
    slippers: [
        ...commonFilters,
        { id: 'brand', label: 'Brand', options: ['Common Projects', 'Nike', 'Adidas'] },
        { id: 'size', label: 'Size', options: ['EU 38', 'EU 42', 'EU 44'] },
        { id: 'color', label: 'Color', options: ['White', 'Black', 'White/Black'] },
    ],
    accessories: [
        ...commonFilters,
        { id: 'brand', label: 'Brand', options: ['Bellroy', 'Ray-Ban'] },
        { id: 'material', label: 'Material', options: ['Leather', 'Acetate'] },
    ]
};

export function filterProducts(products: Product[], activeFilters: Record<string, string[]>) {
    return products.filter(product => {
        for (const [filterKey, selectedOptions] of Object.entries(activeFilters)) {
            if (selectedOptions.length === 0) continue;

            if (filterKey === 'priceRange') {
                const price = product.price;
                const matchesPrice = selectedOptions.some(option => {
                    if (option === 'Under 1000') return price < 100;
                    if (option === '₹1000 - 2000') return price >= 100 && price <= 200;
                    if (option === '₹2000+') return price > 200;
                    return false;
                });
                if (!matchesPrice) return false;
                continue;
            }

            const productValue = (product as any)[filterKey]?.toString().toLowerCase();
            const matches = selectedOptions.some(option => option.toLowerCase() === productValue);

            if (!matches) return false;
        }
        return true;
    });
}