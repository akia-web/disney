-- CreateTable
CREATE TABLE "Dreamsnap" (
    "id" SERIAL NOT NULL,
    "theme" TEXT NOT NULL,
    "moonlight" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dreamsnap_pkey" PRIMARY KEY ("id")
);
