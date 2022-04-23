/*
  Warnings:

  - You are about to drop the column `visits` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "visits";

-- CreateTable
CREATE TABLE "LinkVisit" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" VARCHAR(15) NOT NULL,
    "userAgent" TEXT NOT NULL,

    CONSTRAINT "LinkVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LinkVisit" ADD CONSTRAINT "LinkVisit_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
