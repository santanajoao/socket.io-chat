-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('DIRECT', 'GROUP');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('GLOBAL', 'PRIVATE');

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "type" "ChatType" NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupChat" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "groupType" "GroupType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_user_id" TEXT NOT NULL,

    CONSTRAINT "GroupChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "join_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "send_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupChat_chat_id_key" ON "GroupChat"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_chat_id_user_id_key" ON "ChatUser"("chat_id", "user_id");

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
