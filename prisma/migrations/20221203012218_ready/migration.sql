/*
  Warnings:

  - You are about to drop the column `productId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Wishlist` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Wishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Wishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_productId_key";

-- DropIndex
DROP INDEX "Wishlist_productId_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "productId",
ADD COLUMN     "carrierId" TEXT,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "originalPrice" INTEGER,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "shippingPrice" INTEGER,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "totalPrice" INTEGER;

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "productId",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
