/*
  Warnings:

  - Made the column `description` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `brandId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brandId" INTEGER NOT NULL;
