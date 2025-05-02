/*
  Warnings:

  - You are about to drop the column `created_at` on the `group_chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "group_chats" DROP COLUMN "created_at";
