/*
  Warnings:

  - Added the required column `gender` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "Employees" ADD COLUMN     "gender" "Gender" NOT NULL;
