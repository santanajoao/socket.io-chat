-- AlterTable
ALTER TABLE "chat_invites" ADD COLUMN     "accepted" BOOLEAN,
ADD COLUMN     "acceptedAt" TIMESTAMP(3);
