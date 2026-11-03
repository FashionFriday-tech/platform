import { PrismaClient } from './node_modules/@prisma/client/index.js';
import { MAJOR_COLORS } from '../schemas/dist/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log(`🎨 Seeding ${MAJOR_COLORS.length} colors into database...`);

  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const c of MAJOR_COLORS) {
    const existing = await prisma.color.findFirst({
      where: {
        name: { equals: c.name.trim(), mode: 'insensitive' },
      },
    });

    if (!existing) {
      await prisma.color.create({
        data: {
          name: c.name.trim(),
          hex: c.hex.trim().toUpperCase(),
        },
      });
      added++;
    } else {
      if (existing.hex !== c.hex.trim().toUpperCase()) {
        await prisma.color.update({
          where: { id: existing.id },
          data: { hex: c.hex.trim().toUpperCase() },
        });
        updated++;
      } else {
        skipped++;
      }
    }
  }

  const total = await prisma.color.count();
  console.log(`✅ Finished seeding colors! Added: ${added}, Updated: ${updated}, Skipped: ${skipped}, Total in DB: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding colors:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

