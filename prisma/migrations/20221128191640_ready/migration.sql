-- CreateTable
CREATE TABLE "Wilaya" (
    "id" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "zip_code" TEXT,
    "code_ons" TEXT,
    "daira" TEXT,
    "wilaya" TEXT NOT NULL,
    "wilaya_id" INTEGER NOT NULL,
    "wilaya_zip_code" TEXT NOT NULL,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("id")
);
