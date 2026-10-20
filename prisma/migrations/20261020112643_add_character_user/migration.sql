-- CreateTable
CREATE TABLE "CharacterUser" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "CharacterUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterUser_characterId_userId_key" ON "CharacterUser"("characterId", "userId");

-- AddForeignKey
ALTER TABLE "CharacterUser" ADD CONSTRAINT "CharacterUser_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterUser" ADD CONSTRAINT "CharacterUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
