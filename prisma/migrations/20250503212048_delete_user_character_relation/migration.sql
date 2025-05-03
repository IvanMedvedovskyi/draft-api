/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Character` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_ownerId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "ownerId";
