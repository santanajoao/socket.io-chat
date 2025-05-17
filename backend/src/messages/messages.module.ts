import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagePrismaRepository } from './repositories/message-prisma.repository';
import { MessageReadPrismaRepository } from './repositories/message-read-prisma.repository';

@Module({
  imports: [],
  providers: [
    MessagesService,
    MessagePrismaRepository,
    MessageReadPrismaRepository,
  ],
  exports: [
    MessagesService,
    MessagePrismaRepository,
    MessageReadPrismaRepository,
  ],
  controllers: [],
})
export class MessagesModule {}
