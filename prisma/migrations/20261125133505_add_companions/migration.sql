-- CreateTable
CREATE TABLE "Companion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Companion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanionAvailability" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "companionId" INTEGER NOT NULL,

    CONSTRAINT "CompanionAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanionUser" (
    "id" SERIAL NOT NULL,
    "companionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isObtained" BOOLEAN NOT NULL,

    CONSTRAINT "CompanionUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Companion_name_key" ON "Companion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CompanionUser_companionId_userId_key" ON "CompanionUser"("companionId", "userId");

-- AddForeignKey
ALTER TABLE "Companion" ADD CONSTRAINT "Companion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionAvailability" ADD CONSTRAINT "CompanionAvailability_companionId_fkey" FOREIGN KEY ("companionId") REFERENCES "Companion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionUser" ADD CONSTRAINT "CompanionUser_companionId_fkey" FOREIGN KEY ("companionId") REFERENCES "Companion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionUser" ADD CONSTRAINT "CompanionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
