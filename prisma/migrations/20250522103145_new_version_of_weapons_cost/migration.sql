-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageWeapon" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "imageSpecialization" TEXT NOT NULL,
    "rarity" INTEGER NOT NULL,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageChar" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "imageElement" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "imageSpec" TEXT NOT NULL,
    "rarity" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminPanelUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "securityCode" TEXT,
    "codeExpiresAt" TIMESTAMP(3),

    CONSTRAINT "AdminPanelUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterCost" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "ownerContact" TEXT NOT NULL,
    "canEditBy" TEXT[],
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

-- CreateTable
CREATE TABLE "WeaponCost" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "r1" INTEGER NOT NULL,
    "r2" INTEGER NOT NULL,
    "r3" INTEGER NOT NULL,
    "r4" INTEGER NOT NULL,
    "r5" INTEGER NOT NULL,
    "another_r1" INTEGER NOT NULL,
    "another_r2" INTEGER NOT NULL,
    "another_r3" INTEGER NOT NULL,
    "another_r4" INTEGER NOT NULL,
    "another_r5" INTEGER NOT NULL,
    "offbuild" INTEGER NOT NULL,
    "tableName" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "ownerContact" TEXT NOT NULL,
    "canEditBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeaponCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPanelUser_email_key" ON "AdminPanelUser"("email");

-- AddForeignKey
ALTER TABLE "CharacterCost" ADD CONSTRAINT "CharacterCost_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
