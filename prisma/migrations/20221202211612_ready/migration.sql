/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Daira` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Daira_name_key" ON "Daira"("name");