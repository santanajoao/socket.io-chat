-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('DEFAULT', 'ALERT');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'DEFAULT',
ALTER COLUMN "user_id" DROP NOT NULL;
