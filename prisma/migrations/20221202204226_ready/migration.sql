/*
  Warnings:

  - The primary key for the `Wilaya` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code_ons` on the `Wilaya` table. All the data in the column will be lost.
  - You are about to drop the column `commune` on the `Wilaya` table. All the data in the column will be lost.
  - You are about to drop the column `daira` on the `Wilaya` table. All the data in the column will be lost.
  - You are about to drop the column `post` on the `Wilaya` table. All the data in the column will be lost.
  - You are about to drop the column `wilaya` on the `Wilaya` table. All the data in the column will be lost.
  - You are about to drop the column `wilaya_id` on the `Wilaya` table. All the data in the column will be lost.
  - You are about to drop the column `wilaya_zip_code` on the `Wilaya` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Wilaya` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zip_code]` on the table `Wilaya` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Wilaya` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Wilaya` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `zip_code` on table `Wilaya` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Wilaya" DROP CONSTRAINT "Wilaya_pkey",
DROP COLUMN "code_ons",
DROP COLUMN "commune",
DROP COLUMN "daira",
DROP COLUMN "post",
DROP COLUMN "wilaya",
DROP COLUMN "wilaya_id",
DROP COLUMN "wilaya_zip_code",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ALTER COLUMN "zip_code" SET NOT NULL,
ADD CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Daira" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wilayaId" INTEGER NOT NULL,

    CONSTRAINT "Daira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commune" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code_ons" TEXT,
    "dairaId" TEXT,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "communeId" TEXT,
    "wilayaId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Daira_wilayaId_idx" ON "Daira"("wilayaId");

-- CreateIndex
CREATE UNIQUE INDEX "Commune_code_ons_key" ON "Commune"("code_ons");

-- CreateIndex
CREATE INDEX "Commune_dairaId_idx" ON "Commune"("dairaId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_zip_code_key" ON "Post"("zip_code");

-- CreateIndex
CREATE INDEX "Post_wilayaId_idx" ON "Post"("wilayaId");

-- CreateIndex
CREATE INDEX "Post_communeId_idx" ON "Post"("communeId");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wilaya_name_key" ON "Wilaya"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Wilaya_zip_code_key" ON "Wilaya"("zip_code");

-- CreateIndex
CREATE INDEX "Wishlist_userId_idx" ON "Wishlist"("userId");
