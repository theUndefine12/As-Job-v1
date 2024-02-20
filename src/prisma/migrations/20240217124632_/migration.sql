/*
  Warnings:

  - You are about to drop the column `email` on the `Employees` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Employer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Employer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Employees` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Employer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Employees_email_key";

-- DropIndex
DROP INDEX "Employer_email_key";

-- AlterTable
ALTER TABLE "Employees" DROP COLUMN "email",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "phone" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Employer" DROP COLUMN "email",
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employees_phone_key" ON "Employees"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Employer_phone_key" ON "Employer"("phone");
