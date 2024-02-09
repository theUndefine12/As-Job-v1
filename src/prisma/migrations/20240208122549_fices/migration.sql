/*
  Warnings:

  - You are about to drop the column `Conditions` on the `Vacation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vacation" DROP COLUMN "Conditions",
ADD COLUMN     "conditions" TEXT[];
