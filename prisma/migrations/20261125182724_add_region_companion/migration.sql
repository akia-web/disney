/*
  Warnings:

  - You are about to drop the column `loveOptions` on the `Companion` table. All the data in the column will be lost.
  - Added the required column `region` to the `Companion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Companion" DROP COLUMN "loveOptions",
ADD COLUMN     "region" TEXT NOT NULL;
