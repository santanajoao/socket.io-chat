/*
  Warnings:

  - The primary key for the `chat_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `chat_users` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `messages` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "chat_users_chat_id_user_id_key";

-- AlterTable
ALTER TABLE "chat_users" DROP CONSTRAINT "chat_users_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "chat_users_pkey" PRIMARY KEY ("chat_id", "user_id");

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "is_read";

-- CreateTable
CREATE TABLE "message_reads" (
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("message_id","user_id")
);

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
