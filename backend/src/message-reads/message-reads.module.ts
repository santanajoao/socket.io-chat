import { Module } from '@nestjs/common';
import { MessageReadPrismaRepository } from './repositories/message-read-prisma.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [MessageReadPrismaRepository],
  exports: [MessageReadPrismaRepository],
})
export class MessageReadsModule {}
