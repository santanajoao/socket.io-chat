/*
  Warnings:

  - You are about to drop the column `join_datetime` on the `chat_users` table. All the data in the column will be lost.
  - You are about to drop the column `creator_user_id` on the `group_chats` table. All the data in the column will be lost.
  - You are about to drop the column `groupType` on the `group_chats` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `send_datetime` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `messages` table. All the data in the column will be lost.
  - Added the required column `group_type` to the `group_chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_read` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "group_chats" DROP CONSTRAINT "group_chats_creator_user_id_fkey";

-- AlterTable
ALTER TABLE "chat_users" DROP COLUMN "join_datetime",
ADD COLUMN     "join_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "group_chats" DROP COLUMN "creator_user_id",
DROP COLUMN "groupType",
ADD COLUMN     "created_by_user_id" TEXT,
ADD COLUMN     "group_type" "GroupType" NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "isRead",
DROP COLUMN "send_datetime",
DROP COLUMN "text",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "is_read" BOOLEAN NOT NULL,
ADD COLUMN     "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "group_chats" ADD CONSTRAINT "group_chats_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
