/*
  Warnings:

  - You are about to drop the column `domainId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Domain` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workspaceId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_domainId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "domainId",
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Domain";

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_subdomain_key" ON "Workspace"("subdomain");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
