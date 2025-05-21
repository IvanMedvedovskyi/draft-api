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

    CONSTRAINT "WeaponCost_pkey" PRIMARY KEY ("id")
);
