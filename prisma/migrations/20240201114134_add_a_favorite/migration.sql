/*
  Warnings:

  - You are about to drop the `_EmployeesToResume` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `country` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeesId` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vacation" DROP CONSTRAINT "Vacation_employeesId_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeesToResume" DROP CONSTRAINT "_EmployeesToResume_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeesToResume" DROP CONSTRAINT "_EmployeesToResume_B_fkey";

-- AlterTable
ALTER TABLE "Employees" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "employeesId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vacation" ADD COLUMN     "favoritesId" INTEGER;

-- DropTable
DROP TABLE "_EmployeesToResume";

-- CreateTable
CREATE TABLE "Favorites" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "employeesId" INTEGER NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmployeesToVacation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeesToVacation_AB_unique" ON "_EmployeesToVacation"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeesToVacation_B_index" ON "_EmployeesToVacation"("B");

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeesToVacation" ADD CONSTRAINT "_EmployeesToVacation_A_fkey" FOREIGN KEY ("A") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeesToVacation" ADD CONSTRAINT "_EmployeesToVacation_B_fkey" FOREIGN KEY ("B") REFERENCES "Vacation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
