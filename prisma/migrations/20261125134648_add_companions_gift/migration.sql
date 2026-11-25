/*
  Warnings:

  - Added the required column `loveImage` to the `Companion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loveName` to the `Companion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Game" AS ENUM ('BASE_GAME', 'DLC1', 'DLC2', 'DLC3', 'DLC4', 'ADVENTURE_PACK_1');

-- AlterTable
ALTER TABLE "Companion" ADD COLUMN     "game" "Game" NOT NULL DEFAULT 'BASE_GAME',
ADD COLUMN     "loveImage" TEXT NOT NULL,
ADD COLUMN     "loveName" TEXT NOT NULL,
ADD COLUMN     "loveOptions" TEXT[] DEFAULT ARRAY[]::TEXT[];
