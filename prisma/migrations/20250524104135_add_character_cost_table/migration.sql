/*
  Warnings:

  - You are about to drop the column `canEditBy` on the `CharacterCost` table. All the data in the column will be lost.
  - You are about to drop the column `creatorName` on the `CharacterCost` table. All the data in the column will be lost.
  - You are about to drop the column `ownerContact` on the `CharacterCost` table. All the data in the column will be lost.
  - You are about to drop the column `tableName` on the `CharacterCost` table. All the data in the column will be lost.
  - Added the required column `tableId` to the `CharacterCost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CharacterCost" DROP COLUMN "canEditBy",
DROP COLUMN "creatorName",
DROP COLUMN "ownerContact",
DROP COLUMN "tableName",
ADD COLUMN     "tableId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CharacterCostTable" (
    "id" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "ownerContact" TEXT NOT NULL,
    "canEditBy" TEXT[],

    CONSTRAINT "CharacterCostTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharacterCost" ADD CONSTRAINT "CharacterCost_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "CharacterCostTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
