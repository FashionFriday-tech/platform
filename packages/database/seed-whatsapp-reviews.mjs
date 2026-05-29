/**
 * Seed script to upload the 10 original WhatsApp review images
 * to the new WhatsAppReview table via the API.
 *
 * Deletes all existing reviews first, then uploads fresh.
 *
 * Usage: node seed-whatsapp-reviews.mjs
 *
 * Make sure the API server is running at http://127.0.0.1:3002
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3002';
const IMAGES_DIR = resolve(import.meta.dirname, '../../apps/web/public/images/reviews');

const IMAGE_FILES = [
  { file: '1.jpg', name: 'fashion-friday-whatsapp-sales-review-1' },
  { file: '2.jpg', name: 'fashion-friday-whatsapp-sales-review-2' },
  { file: '3.jpg', name: 'fashion-friday-whatsapp-sales-review-3' },
  { file: '4.jpg', name: 'fashion-friday-whatsapp-sales-review-4' },
  { file: '5.jpg', name: 'fashion-friday-whatsapp-sales-review-5' },
  { file: '6.jpg', name: 'fashion-friday-whatsapp-sales-review-6' },
  { file: '7.jpg', name: 'fashion-friday-whatsapp-sales-review-7' },
  { file: '8.jpg', name: 'fashion-friday-whatsapp-sales-review-8' },
  { file: '9.jpg', name: 'fashion-friday-whatsapp-sales-review-9' },
  { file: '10.jpg', name: 'fashion-friday-whatsapp-sales-review-10' },
];

async function deleteAllReviews() {
  console.log('🗑️  Deleting existing reviews...');
  const res = await fetch(`${API_URL}/admin/whatsapp-reviews`);
  if (!res.ok) {
    console.log('  No existing reviews to delete');
    return;
  }
  const reviews = await res.json();
  for (const review of reviews) {
    const delRes = await fetch(`${API_URL}/admin/whatsapp-reviews/${review.id}`, {
      method: 'DELETE',
    });
    if (delRes.ok) {
      console.log(`  🗑️  Deleted ${review.id}`);
    } else {
      console.error(`  ❌ Failed to delete ${review.id}`);
    }
  }
  console.log(`  Deleted ${reviews.length} reviews\n`);
}

async function seed() {
  console.log('🌱 Seeding WhatsApp review images...\n');
  console.log(`  API: ${API_URL}`);
  console.log(`  Images: ${IMAGES_DIR}\n`);

  // Step 1: Delete all existing reviews
  await deleteAllReviews();

  // Step 2: Upload fresh originals
  let uploaded = 0;
  let failed = 0;

  for (const item of IMAGE_FILES) {
    const { file: filename, name: seoName } = item;
    const filePath = resolve(IMAGES_DIR, filename);
    try {
      const fileBuffer = readFileSync(filePath);
      const blob = new Blob([fileBuffer], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', blob, `${seoName}.jpg`);

      const res = await fetch(`${API_URL}/admin/whatsapp-reviews`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      const data = await res.json();
      console.log(`  ✅ ${filename} (${seoName}) → ${data.imageUrl}`);
      uploaded++;
    } catch (err) {
      console.error(`  ❌ ${filename}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🏁 Done: ${uploaded} uploaded, ${failed} failed`);
}

seed().catch(console.error);
