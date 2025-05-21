/*
  Warnings:

  - You are about to drop the column `name` on the `CharacterCost` table. All the data in the column will be lost.
  - Added the required column `characterId` to the `CharacterCost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CharacterCost" DROP CONSTRAINT "CharacterCost_name_fkey";

-- DropIndex
DROP INDEX "CharacterCost_name_key";

-- AlterTable
ALTER TABLE "CharacterCost" DROP COLUMN "name",
ADD COLUMN     "characterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CharacterCost" ADD CONSTRAINT "CharacterCost_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
