/*
  Warnings:

  - A unique constraint covering the columns `[userId,game]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Player_username_key";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_game_key" ON "Player"("userId", "game");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
