/*
  Warnings:

  - Added the required column `profession` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employees" ADD COLUMN     "profession" TEXT NOT NULL;
