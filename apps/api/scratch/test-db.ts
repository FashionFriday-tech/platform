import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing connection...');
    await prisma.$connect();
    console.log('Connected!');

    const phone = '9876543210';
    const otpHash = 'test_hash';
    const expiresAt = new Date();

    console.log('Testing upsert...');
    await prisma.otp.upsert({
      where: { phone },
      update: { otpHash, expiresAt },
      create: { phone, otpHash, expiresAt },
    });
    console.log('Upsert successful!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
