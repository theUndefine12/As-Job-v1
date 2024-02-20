/*
  Warnings:

  - You are about to drop the column `employeesId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `employerId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `owner` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Owner" AS ENUM ('Employees', 'Employer');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_employeesId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_employerId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "employeesId",
DROP COLUMN "employerId",
ADD COLUMN     "owner" "Owner" NOT NULL,
ADD COLUMN     "ownerId" INTEGER NOT NULL;
