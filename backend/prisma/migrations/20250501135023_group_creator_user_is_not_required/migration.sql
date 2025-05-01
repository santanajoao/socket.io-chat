-- DropForeignKey
ALTER TABLE "GroupChat" DROP CONSTRAINT "GroupChat_creator_user_id_fkey";

-- AlterTable
ALTER TABLE "GroupChat" ALTER COLUMN "creator_user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
