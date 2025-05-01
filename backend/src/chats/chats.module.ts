import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';

@Module({
  providers: [ChatsGateway, ChatsService, ChatPrismaRepository],
  exports: [ChatPrismaRepository],
})
export class ChatsModule {}
