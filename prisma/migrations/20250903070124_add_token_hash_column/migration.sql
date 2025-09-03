/*
  Warnings:

  - Added the required column `tokenHash` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "tokenHash" TEXT NOT NULL,
ALTER COLUMN "token" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Token_tokenHash_idx" ON "Token"("tokenHash");
