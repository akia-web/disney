/*
  Warnings:

  - You are about to drop the column `hour` on the `CompanionAvailability` table. All the data in the column will be lost.
  - Added the required column `from` to the `CompanionAvailability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `CompanionAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanionAvailability" DROP COLUMN "hour",
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "to" TEXT NOT NULL;
