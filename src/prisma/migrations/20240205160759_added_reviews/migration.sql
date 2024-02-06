-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "vacationId" INTEGER;

-- AlterTable
ALTER TABLE "Vacation" ADD COLUMN     "reviewsCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_vacationId_fkey" FOREIGN KEY ("vacationId") REFERENCES "Vacation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
