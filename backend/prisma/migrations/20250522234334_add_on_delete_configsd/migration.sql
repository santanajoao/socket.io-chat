-- DropForeignKey
ALTER TABLE "chat_invites" DROP CONSTRAINT "chat_invites_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_invites" DROP CONSTRAINT "chat_invites_receiver_user_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_invites" DROP CONSTRAINT "chat_invites_sender_user_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_users" DROP CONSTRAINT "chat_users_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_users" DROP CONSTRAINT "chat_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "group_chats" DROP CONSTRAINT "group_chats_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_message_id_fkey";

-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_id_fkey";

-- AddForeignKey
ALTER TABLE "group_chats" ADD CONSTRAINT "group_chats_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_invites" ADD CONSTRAINT "chat_invites_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_invites" ADD CONSTRAINT "chat_invites_receiver_user_id_fkey" FOREIGN KEY ("receiver_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_invites" ADD CONSTRAINT "chat_invites_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
