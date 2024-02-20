/*
  Warnings:

  - You are about to drop the column `notices` on the `Notice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "notices";

-- CreateTable
CREATE TABLE "Notices" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "employerId" INTEGER NOT NULL,
    "vacationId" INTEGER NOT NULL,
    "noticeId" INTEGER,

    CONSTRAINT "Notices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notices" ADD CONSTRAINT "Notices_vacationId_fkey" FOREIGN KEY ("vacationId") REFERENCES "Vacation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notices" ADD CONSTRAINT "Notices_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notices" ADD CONSTRAINT "Notices_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
