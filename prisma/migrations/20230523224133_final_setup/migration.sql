/*
  Warnings:

  - You are about to drop the column `details` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Tracking` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_productId_key";

-- DropIndex
DROP INDEX "Product_id_key";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "properties" JSONB;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "details",
DROP COLUMN "productId",
ADD COLUMN     "cancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "properties" JSONB,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tracking";

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_orderId_idx" ON "Product"("orderId");
