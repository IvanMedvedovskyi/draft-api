/*
  Warnings:

  - You are about to drop the `Weapon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Weapon";

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "specialization" TEXT,
    "element" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
