-- CreateEnum
CREATE TYPE "public"."CheckoutStatus" AS ENUM ('CART', 'SHIPPING', 'PAYMENT', 'PAYMENT_ERROR', 'CONFIRMATION');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "public"."Checkout" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "status" "public"."CheckoutStatus" NOT NULL DEFAULT 'CART',
    "shippingAddress" JSONB,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "orderId" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);
