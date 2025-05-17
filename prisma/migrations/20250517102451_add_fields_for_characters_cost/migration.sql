/*
  Warnings:

  - Added the required column `creatorName` to the `CharacterCost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerContact` to the `CharacterCost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CharacterCost" ADD COLUMN     "canEditBy" TEXT[],
ADD COLUMN     "creatorName" TEXT NOT NULL,
ADD COLUMN     "ownerContact" TEXT NOT NULL;
