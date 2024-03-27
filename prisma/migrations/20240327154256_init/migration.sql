-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "email" TEXT,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "rating" SET DEFAULT 5;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
