-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "imageWeapon" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "imageSpecialization" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);
