import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '../src/index';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../../apps/api/.env') });

const prisma = new PrismaClient();

const bucketName = process.env.R2_BUCKET_NAME || 'fashionfriday-assets';
const publicUrl = process.env.R2_PUBLIC_URL || '';
const accountId = process.env.R2_ACCOUNT_ID;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

async function main() {
  const logosDir = path.join(__dirname, '../../../apps/admin/brand-logos');
  const files = await fs.readdir(logosDir);

  let successCount = 0;
  for (const file of files) {
    if (!file.match(/\.(png|jpg|jpeg|webp)$/i)) continue;

    console.log(`Processing ${file}...`);
    
    // Attempt to match the brand based on slug
    const brandName = file.substring(0, file.lastIndexOf('.'));
    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const brand = await prisma.brand.findUnique({ where: { slug } });
    
    if (!brand) {
      console.warn(`[WARNING] Brand not found for slug '${slug}'. Uploading anyway...`);
    }

    const filePath = path.join(logosDir, file);
    const fileBuffer = await fs.readFile(filePath);

    try {
      const processedBuffer = await sharp(fileBuffer).webp({ quality: 80 }).toBuffer();
      
      const fileName = `brands/${slug}.webp`;
      
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: processedBuffer,
          ContentType: 'image/webp',
        })
      );
      
      const url = `${publicUrl}/${fileName}`;
      
      if (brand) {
        await prisma.brand.update({
          where: { id: brand.id },
          data: { logo: url }
        });
        console.log(`[SUCCESS] Updated DB for '${slug}' -> ${url}`);
      } else {
        console.log(`[SUCCESS] Uploaded to '${url}' (No DB record updated)`);
      }
      
      successCount++;
    } catch (err) {
      console.error(`[ERROR] Failed to process '${file}':`, err);
    }
  }
  
  console.log(`\nCompleted! Successfully processed ${successCount} logos.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
