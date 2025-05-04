import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagePrismaRepository } from './repositories/message-prisma.repository';

@Module({
  imports: [],
  providers: [MessagesService, MessagePrismaRepository],
  exports: [MessagesService, MessagePrismaRepository],
  controllers: [],
})
export class MessagesModule {}
