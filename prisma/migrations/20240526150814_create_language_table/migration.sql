-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('js', 'ts', 'python', 'go');

-- AlterTable
ALTER TABLE "challenges" ALTER COLUMN "inputs" SET DATA TYPE JSON;

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "code" "LanguageCode" NOT NULL,
    "template" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_challenges_languages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_challenges_languages_AB_unique" ON "_challenges_languages"("A", "B");

-- CreateIndex
CREATE INDEX "_challenges_languages_B_index" ON "_challenges_languages"("B");

-- AddForeignKey
ALTER TABLE "_challenges_languages" ADD CONSTRAINT "_challenges_languages_A_fkey" FOREIGN KEY ("A") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_challenges_languages" ADD CONSTRAINT "_challenges_languages_B_fkey" FOREIGN KEY ("B") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
