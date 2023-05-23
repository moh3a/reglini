
-- CreateEnum
CREATE TYPE "ACCOUNT_TYPE" AS ENUM ('OAUTH', 'CREDENTIALS');

-- CreateEnum
CREATE TYPE "AUTH_PROVIDER" AS ENUM ('FACEBOOK', 'GOOGLE');

-- CreateEnum
CREATE TYPE "ROLES" AS ENUM ('BASIC', 'ADMIN');

-- CreateEnum
CREATE TYPE "PAYMENT_METHOD" AS ENUM ('CCP', 'CIB');

-- CreateEnum
CREATE TYPE "CURRENCIES" AS ENUM ('EUR', 'USD', 'GBP');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "ROLES" NOT NULL DEFAULT 'BASIC',
    "account" "ACCOUNT_TYPE" NOT NULL,
    "provider" "AUTH_PROVIDER",
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordExpire" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "realName" TEXT,
    "picture" TEXT,
    "phoneNumber" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postalCode" TEXT,
    "wilaya" TEXT,
    "daira" TEXT,
    "commune" TEXT,
    "streetName" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "imageUrl" TEXT NOT NULL,
    "quantity" INTEGER,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "totalPrice" INTEGER,
    "shippingPrice" INTEGER,
    "carrierId" TEXT,
    "orderMemo" TEXT DEFAULT 'Please do not put invoices or any other document inside the package. Instead send them to this email address support@reglini-dz.com. Thank you very much.'
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "details" JSONB,
    "currency" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Shipping" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "phoneCountry" TEXT,
    "countryCode" TEXT NOT NULL,
    "zipCode" TEXT,
    "province" TEXT,
    "city" TEXT NOT NULL,
    "addressLine1" TEXT,

    CONSTRAINT "Shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "hasTimedOut" BOOLEAN NOT NULL DEFAULT false,
    "isPaymentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "wasDeclined" BOOLEAN,
    "receipt" TEXT,
    "paymentMethod" "PAYMENT_METHOD",
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracking" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "hasTracking" BOOLEAN NOT NULL DEFAULT false,
    "official_website" TEXT,
    "details" JSONB,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageReceipt" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "wasReceived" BOOLEAN NOT NULL DEFAULT false,
    "packagePicture" TEXT,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER,
    "message" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "exchange" "CURRENCIES",
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parallel_sale" INTEGER,
    "parallel_purchase" INTEGER,
    "official_rate" INTEGER,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_account_idx" ON "User"("email", "account");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_realName_idx" ON "Profile"("realName");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_productId_key" ON "Cart"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_productId_key" ON "Wishlist"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_productId_key" ON "Order"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_orderId_key" ON "Shipping"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_orderId_key" ON "Tracking"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageReceipt_orderId_key" ON "PackageReceipt"("orderId");

-- CreateIndex
CREATE INDEX "Currency_exchange_idx" ON "Currency"("exchange");
