/*
  Warnings:

  - You are about to drop the column `value` on the `MainCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MainCategory" DROP COLUMN "value";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "gender" TEXT;
