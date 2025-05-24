/*
  Warnings:

  - You are about to drop the column `canEditBy` on the `WeaponCost` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `WeaponCost` table. All the data in the column will be lost.
  - You are about to drop the column `creatorName` on the `WeaponCost` table. All the data in the column will be lost.
  - You are about to drop the column `ownerContact` on the `WeaponCost` table. All the data in the column will be lost.
  - You are about to drop the column `tableName` on the `WeaponCost` table. All the data in the column will be lost.
  - Added the required column `tableId` to the `WeaponCost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeaponCost" DROP COLUMN "canEditBy",
DROP COLUMN "createdAt",
DROP COLUMN "creatorName",
DROP COLUMN "ownerContact",
DROP COLUMN "tableName",
ADD COLUMN     "tableId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "WeaponCostTable" (
    "id" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "ownerContact" TEXT NOT NULL,
    "canEditBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeaponCostTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeaponCost" ADD CONSTRAINT "WeaponCost_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "WeaponCostTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
