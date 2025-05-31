/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `chat_users` table. All the data in the column will be lost.
  - You are about to drop the column `join_at` on the `chat_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat_users" DROP COLUMN "isAdmin",
DROP COLUMN "join_at",
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
