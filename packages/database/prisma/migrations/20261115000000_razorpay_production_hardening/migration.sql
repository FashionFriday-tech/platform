-- Fashion Friday: Razorpay Manual Capture Production Hardening Migration
-- Version-controlled migration compatible with existing data and multi-instance zero-downtime deployment

-- 1. Extend PaymentStatus enum with explicit FinTech transition states
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CAPTURE_PENDING';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'VOID_PENDING';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'VOIDED';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'REFUND_PENDING';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'PARTIALLY_REFUNDED';

-- 2. Add cumulative refund and advance tracking to orders table
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "refundedAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "advanceAmount" DECIMAL(12, 2) NOT NULL DEFAULT 0;

-- 3. Create transactional webhook inbox table for durable event deduplication and crash recovery
CREATE TABLE IF NOT EXISTS "webhook_events" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "payload" JSONB,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- Cluster Lock lease table for PgBouncer-safe multi-instance leader election
CREATE TABLE IF NOT EXISTS "cluster_locks" (
    "id" TEXT NOT NULL,
    "lockedBy" TEXT NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cluster_locks_pkey" PRIMARY KEY ("id")
);

-- Ensure all inbox columns exist if table was partially created
ALTER TABLE "webhook_events" ADD COLUMN IF NOT EXISTS "attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "webhook_events" ADD COLUMN IF NOT EXISTS "lastError" TEXT;
ALTER TABLE "webhook_events" ADD COLUMN IF NOT EXISTS "processedAt" TIMESTAMP(3);
ALTER TABLE "webhook_events" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 4. High-Performance FinTech Indexes for Reconciliation and Querying
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_orderNumber_idx" ON "orders"("orderNumber");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE INDEX IF NOT EXISTS "orders_paymentStatus_idx" ON "orders"("paymentStatus");
CREATE INDEX IF NOT EXISTS "orders_createdAt_idx" ON "orders"("createdAt");

CREATE INDEX IF NOT EXISTS "webhook_events_event_idx" ON "webhook_events"("event");
CREATE INDEX IF NOT EXISTS "webhook_events_status_idx" ON "webhook_events"("status");
CREATE INDEX IF NOT EXISTS "webhook_events_createdAt_idx" ON "webhook_events"("createdAt");
