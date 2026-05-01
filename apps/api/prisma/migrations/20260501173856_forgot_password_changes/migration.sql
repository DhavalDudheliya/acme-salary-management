/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,tagId,ticketId]` on the table `TagSuggestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `TagSuggestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TagSuggestion_tagId_ticketId_key";

-- AlterTable
ALTER TABLE "TagSuggestion" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TagSuggestion_workspaceId_tagId_ticketId_key" ON "TagSuggestion"("workspaceId", "tagId", "ticketId");

-- AddForeignKey
ALTER TABLE "TagSuggestion" ADD CONSTRAINT "TagSuggestion_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
