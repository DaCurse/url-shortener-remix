-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_code_key" ON "Link"("code");
