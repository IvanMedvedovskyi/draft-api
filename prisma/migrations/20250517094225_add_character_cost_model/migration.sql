/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Character` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "CharacterCost" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "m0" INTEGER NOT NULL,
    "m1" INTEGER NOT NULL,
    "m2" INTEGER NOT NULL,
    "m3" INTEGER NOT NULL,
    "m4" INTEGER NOT NULL,
    "m5" INTEGER NOT NULL,
    "m6" INTEGER NOT NULL,
    "noLimit" BOOLEAN NOT NULL,

    CONSTRAINT "CharacterCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterCost_name_key" ON "CharacterCost"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- AddForeignKey
ALTER TABLE "CharacterCost" ADD CONSTRAINT "CharacterCost_name_fkey" FOREIGN KEY ("name") REFERENCES "Character"("name") ON DELETE CASCADE ON UPDATE CASCADE;
