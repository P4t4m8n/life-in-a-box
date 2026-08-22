-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('PUBLIC', 'PRIVATE', 'USER');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "accessLevel" "AccessLevel" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imgAlt" TEXT,
ADD COLUMN     "imgSrc" TEXT,
ADD COLUMN     "readingTime" TEXT;

-- CreateTable
CREATE TABLE "MainPost" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MainPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecomendedPost" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecomendedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MainPost_postId_key" ON "MainPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "RecomendedPost_postId_key" ON "RecomendedPost"("postId");

-- AddForeignKey
ALTER TABLE "MainPost" ADD CONSTRAINT "MainPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomendedPost" ADD CONSTRAINT "RecomendedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
