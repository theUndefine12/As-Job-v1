/*
  Warnings:

  - Added the required column `description` to the `Vacation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Vacation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proffesion` to the `Vacation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `Vacation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vacation" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "proffesion" TEXT NOT NULL,
ADD COLUMN     "salary" INTEGER NOT NULL;
