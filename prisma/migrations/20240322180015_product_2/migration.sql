-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_mainCategoryId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "mainCategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "MainCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
