/*
  Warnings:

  - Added the required column `adresse` to the `Vacation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vacation" ADD COLUMN     "adresse" TEXT NOT NULL,
ADD COLUMN     "requirements" TEXT[];
