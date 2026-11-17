-- DropForeignKey
ALTER TABLE "CharacterUser" DROP CONSTRAINT "CharacterUser_jobId_fkey";

-- AlterTable
ALTER TABLE "CharacterUser" ALTER COLUMN "jobId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CharacterUser" ADD CONSTRAINT "CharacterUser_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
