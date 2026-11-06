/*
  Warnings:

  - A unique constraint covering the columns `[resetPasswordCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Dreamsnap` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dreamsnap" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expiresResetPasswordCodeAt" TIMESTAMP(3),
ADD COLUMN     "resetPasswordCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordCode_key" ON "User"("resetPasswordCode");
