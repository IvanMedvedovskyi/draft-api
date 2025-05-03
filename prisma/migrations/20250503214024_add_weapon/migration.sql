-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "en" TEXT NOT NULL,
    "ru" TEXT,
    "iconUrl" TEXT NOT NULL,
    "hoyoIconSrc" TEXT,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);
