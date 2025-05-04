import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';
import { ChatPrismaQueryBuilder } from './repositories/chat-prisma.query-builder';
import { ChatsController } from './chats.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { MessageReadsModule } from 'src/message-reads/message-reads.module';

@Module({
  imports: [MessagesModule, MessageReadsModule],
  providers: [
    ChatsGateway,
    ChatsService,
    ChatPrismaRepository,
    ChatPrismaQueryBuilder,
  ],
  exports: [ChatPrismaRepository, ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
