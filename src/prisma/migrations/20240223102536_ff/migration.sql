/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `proffesion` on the `Vacation` table. All the data in the column will be lost.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profession` to the `Vacation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employees" ADD COLUMN     "isResume" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "links" TEXT[];

-- AlterTable
ALTER TABLE "Vacation" DROP COLUMN "proffesion",
ADD COLUMN     "profession" TEXT NOT NULL;

-- DropTable
DROP TABLE "Todo";
