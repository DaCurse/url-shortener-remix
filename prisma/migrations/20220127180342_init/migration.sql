-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "visits" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);
