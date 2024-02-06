/*
  Warnings:

  - Added the required column `company` to the `Vacation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vacation" ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "contacts" TEXT[];
