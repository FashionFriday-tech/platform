import { PrismaClient, Gender, ProductStatus } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../apps/api/.env') });

const prisma = new PrismaClient();

// R2 Setup
const accountId = process.env.R2_ACCOUNT_ID;
const bucketName = process.env.R2_BUCKET_NAME || 'fashionfriday-assets';
const publicUrl = process.env.R2_PUBLIC_URL || '';

let s3Client: S3Client | undefined;
if (accountId && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  console.log('✅ Cloudflare R2 Client initialized.');
} else {
  console.warn('⚠️ R2 environment variables are not configured. Seeding will fall back to original image URLs.');
}

// Reusable download + optimize + upload function
async function uploadImageToR2(url: string, slug: string, folder: string): Promise<string> {
  if (!s3Client || !publicUrl) {
    return url;
  }

  try {
    console.log(`  Downloading image: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} fetching image`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`  Optimizing image with sharp: ${slug}`);
    let processedBuffer: Buffer = buffer;
    let contentType = 'image/webp';
    let fileExtension = 'webp';

    try {
      processedBuffer = await sharp(buffer)
        .resize({
          width: 900,
          height: 1200,
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (sharpError) {
      const errorMessage = sharpError instanceof Error ? sharpError.message : String(sharpError);
      console.warn(`  Failed to optimize with sharp, uploading original: ${errorMessage}`);
      // Try to detect content-type or fallback
      contentType = response.headers.get('content-type') || 'image/jpeg';
      fileExtension = contentType.split('/').pop() || 'jpg';
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const fileName = `${cleanSlug}-${Date.now()}.${fileExtension}`;
    const key = `${folder}/${fileName}`;

    console.log(`  Uploading to R2: ${key}`);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: contentType,
      })
    );

    return `${publicUrl.replace(/\/$/, '')}/${key}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ Failed to upload image ${url} to R2, falling back to original:`, errorMessage);
    return url;
  }
}

async function main() {
  console.log('🌱 Starting Product Database Seeding...');

  // Import mock products dynamically
  // Since products.ts is TypeScript, we resolve and require/import it.
  const productsModulePath = path.resolve(__dirname, './mock-products.ts');
  console.log(`Loading mock products from: ${productsModulePath}`);
  
  // Dynamic import since we run via tsx
  const { pathToFileURL } = await import('url');
  const { DUMMY_PRODUCTS } = await import(pathToFileURL(productsModulePath).href);
  if (!DUMMY_PRODUCTS || !Array.isArray(DUMMY_PRODUCTS)) {
    throw new Error('Could not load DUMMY_PRODUCTS array');
  }

  console.log(`Found ${DUMMY_PRODUCTS.length} mock products to seed.\n`);

  for (const item of DUMMY_PRODUCTS) {
    console.log(`Processing: ${item.name} (${item.slug})`);

    // 1. Resolve/Upsert Category
    const categorySlug = item.categoryId.toLowerCase();
    const categoryName = item.categoryId.charAt(0).toUpperCase() + item.categoryId.slice(1).toLowerCase();
    
    // Check if category exists
    let dbCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!dbCategory) {
      console.log(`  Category "${categoryName}" not found. Creating...`);
      // Upload category icon image to R2 if possible
      const catImage = await uploadImageToR2(item.media.mainImage, `cat-${categorySlug}`, 'categories');
      
      dbCategory = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug,
          image: catImage,
          gender: item.gender as Gender,
        },
      });
      console.log(`  Created Category: ${dbCategory.name} (${dbCategory.id})`);
    }

    // 2. Upload product images to R2
    console.log(`  Uploading media for: ${item.name}`);
    const mainImageR2 = await uploadImageToR2(item.media.mainImage, `${item.slug}-main`, 'products');
    
    let promoImageR2: string | null = null;
    if (item.media.promoImage) {
      promoImageR2 = await uploadImageToR2(item.media.promoImage, `${item.slug}-promo`, 'products');
    }

    const liveImagesR2: string[] = [];
    if (Array.isArray(item.media.liveImages)) {
      for (let i = 0; i < item.media.liveImages.length; i++) {
        const liveUrl = await uploadImageToR2(item.media.liveImages[i], `${item.slug}-live-${i}`, 'products');
        liveImagesR2.push(liveUrl);
      }
    }

    // 3. Upsert Product to Database
    const productData = {
      name: item.name,
      slug: item.slug,
      description: item.description,
      brand: item.brand,
      status: (item.status as ProductStatus) || ProductStatus.PUBLISHED,
      categoryId: dbCategory.id,
      gender: item.gender as Gender,
      
      // Pricing
      ogPrice: item.price.ogPrice,
      sellingPrice: item.price.sellingPrice,
      gettingPrice: item.price.gettingPrice,

      // Media
      mainImage: mainImageR2,
      promoImage: promoImageR2,
      liveImages: liveImagesR2,
      youtubeId: item.media.youtubeId || null,

      // Attributes
      colors: item.attributes.colors,
      quality: item.attributes.quality,
      sizes: item.attributes.sizes,

      // Inventory
      totalStock: item.inventory.totalStock,

      // Matrix
      liveWatching: item.liveMatrix?.liveWatching || 0,
      liveSold: item.liveMatrix?.liveSold || 0,

      // Marketing
      collections: item.marketing?.collections || [],
      isFeatured: item.marketing?.isFeatured || false,
      seoTitle: item.marketing?.seoTitle || null,
      seoDescription: item.marketing?.seoDescription || null,

      // Rating
      averageRating: item.rating?.averageRating || 4.0,
      totalReviews: item.rating?.totalReviews || 0,
    };

    const dbProduct = await prisma.product.upsert({
      where: { slug: item.slug },
      update: productData,
      create: productData,
    });

    console.log(`  Upserted Product: ${dbProduct.name} (ID: ${dbProduct.id})`);

    // 4. Generate Product Variants (Real-time grid size x color combinations)
    // Delete existing variants for fresh seeding
    await prisma.productVariant.deleteMany({
      where: { productId: dbProduct.id },
    });

    const sizes = item.attributes.sizes || [];
    const colors = item.attributes.colors || [];
    const variantsToCreate = [];

    // Calculate stock per variant dynamically
    const totalCombos = sizes.length * colors.length;
    const baseStockPerVariant = totalCombos > 0 ? Math.floor(item.inventory.totalStock / totalCombos) : 0;
    const remainder = totalCombos > 0 ? item.inventory.totalStock % totalCombos : 0;

    let comboIndex = 0;
    for (const size of sizes) {
      for (const color of colors) {
        const variantStock = baseStockPerVariant + (comboIndex < remainder ? 1 : 0);
        variantsToCreate.push({
          productId: dbProduct.id,
          size,
          color,
          stock: variantStock,
          price: item.price.sellingPrice,
        });
        comboIndex++;
      }
    }

    if (variantsToCreate.length > 0) {
      await prisma.productVariant.createMany({
        data: variantsToCreate,
      });
      console.log(`  Created ${variantsToCreate.length} variants for this product.`);
    }

    console.log('----------------------------------------------------');
  }

  console.log('🏁 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
