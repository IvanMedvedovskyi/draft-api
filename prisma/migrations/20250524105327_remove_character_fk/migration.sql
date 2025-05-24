/*
  Warnings:

  - You are about to drop the column `characterId` on the `CharacterCost` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CharacterCost" DROP CONSTRAINT "CharacterCost_characterId_fkey";

-- AlterTable
ALTER TABLE "CharacterCost" DROP COLUMN "characterId";
