/*
  Warnings:

  - You are about to drop the column `resumeId` on the `Employees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employees" DROP CONSTRAINT "Employees_resumeId_fkey";

-- AlterTable
ALTER TABLE "Employees" DROP COLUMN "resumeId",
ADD COLUMN     "responcesCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Employer" ADD COLUMN     "vacationsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vacation" ADD COLUMN     "employeesId" INTEGER;

-- CreateTable
CREATE TABLE "_EmployeesToResume" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeesToResume_AB_unique" ON "_EmployeesToResume"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeesToResume_B_index" ON "_EmployeesToResume"("B");

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeesToResume" ADD CONSTRAINT "_EmployeesToResume_A_fkey" FOREIGN KEY ("A") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeesToResume" ADD CONSTRAINT "_EmployeesToResume_B_fkey" FOREIGN KEY ("B") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
