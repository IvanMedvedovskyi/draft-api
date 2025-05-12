/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Character` table. All the data in the column will be lost.
  - Added the required column `imageChar` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageElement` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageSpec` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rarity` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Character` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specialization` on table `Character` required. This step will fail if there are existing NULL values in that column.
  - Made the column `element` on table `Character` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "imageUrl",
ADD COLUMN     "imageChar" TEXT NOT NULL,
ADD COLUMN     "imageElement" TEXT NOT NULL,
ADD COLUMN     "imageSpec" TEXT NOT NULL,
ADD COLUMN     "rarity" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "specialization" SET NOT NULL,
ALTER COLUMN "element" SET NOT NULL;
