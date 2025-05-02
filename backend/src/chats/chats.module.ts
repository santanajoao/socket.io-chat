import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';
import { ChatPrismaQueryBuilder } from './repositories/chat-prisma.query-builder';

@Module({
  providers: [
    ChatsGateway,
    ChatsService,
    ChatPrismaRepository,
    ChatPrismaQueryBuilder,
  ],
  exports: [ChatPrismaRepository, ChatsService],
})
export class ChatsModule {}
