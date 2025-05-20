import { forwardRef, Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';
import { ChatPrismaQueryBuilder } from './repositories/chat-prisma.query-builder';
import { ChatsController } from './chats.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { InvitesModule } from 'src/invites/invites.module';
import { UsersModule } from 'src/users/users.module';
import { ChatUsersPrismaRepository } from './repositories/chat-users-prisma.repository';
import { ChatFormatter } from './formatters/chat.formatter';
import { GroupChatPrismaRepository } from './repositories/group-chat-prisma.repository';

@Module({
  imports: [
    MessagesModule,
    forwardRef(() => InvitesModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
    ChatsGateway,
    ChatsService,
    ChatPrismaRepository,
    ChatPrismaQueryBuilder,
    ChatUsersPrismaRepository,
    ChatFormatter,
    GroupChatPrismaRepository,
  ],
  exports: [
    ChatPrismaRepository,
    ChatsService,
    ChatUsersPrismaRepository,
    ChatFormatter,
    GroupChatPrismaRepository,
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}
