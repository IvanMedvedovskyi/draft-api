-- CreateTable
CREATE TABLE "AdminPanelUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "securityCode" TEXT,
    "codeExpiresAt" TIMESTAMP(3),

    CONSTRAINT "AdminPanelUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminPanelUser_email_key" ON "AdminPanelUser"("email");
