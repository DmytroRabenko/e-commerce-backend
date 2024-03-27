/*
  Warnings:

  - You are about to drop the `_BrandToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BrandToProduct" DROP CONSTRAINT "_BrandToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_BrandToProduct" DROP CONSTRAINT "_BrandToProduct_B_fkey";

-- DropTable
DROP TABLE "_BrandToProduct";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
