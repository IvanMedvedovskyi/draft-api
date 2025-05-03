-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "element" INTEGER NOT NULL,
    "camp" INTEGER NOT NULL,
    "en" TEXT NOT NULL,
    "ru" TEXT NOT NULL,
    "portrait" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "halfPortrait" TEXT NOT NULL,
    "halfPortrait170" TEXT NOT NULL,
    "iconHoyo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
