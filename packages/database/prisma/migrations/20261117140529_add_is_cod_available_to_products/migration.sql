-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isCodAvailable" BOOLEAN NOT NULL DEFAULT false;
