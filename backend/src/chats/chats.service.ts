import { Injectable } from '@nestjs/common';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';
import { GetUserPaginatedChatListServiceParams } from './dtos/get-user-paginated-chat-list';
import { GetAllUserChatIdsParams } from './dtos/get-all-user-chat-ids';
import { ChatType } from 'generated/prisma';
import { MessagePrismaRepository } from 'src/messages/repositories/message-prisma.repository';
import { MessageReadPrismaRepository } from 'src/message-reads/repositories/message-read-prisma.repository';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatPrismaRepository: ChatPrismaRepository,
    private readonly messagePrismaRepository: MessagePrismaRepository,
    private readonly messageReadPrismaRepository: MessageReadPrismaRepository,
  ) {}

  async getAllUserChatIds({ userId }: GetAllUserChatIdsParams) {
    return this.chatPrismaRepository.getAllUserChatIds({ userId });
  }

  async getUserPaginatedChatList({
    userId,
    cursor,
    pageSize,
  }: GetUserPaginatedChatListServiceParams) {
    const result = await this.chatPrismaRepository.getUserPaginatedChatList({
      userId,
      cursor,
      limit: pageSize + 1,
    });

    const requestedChats = result.chats.slice(0, pageSize);
    const formattedChats = requestedChats.map(
      ({ messages, _count, chatUsers, ...chat }) => {
        const lastMessage = messages[0];

        const targetChatUser = chatUsers.find(
          (chatUser) => chatUser.user.id !== userId,
        );

        const targetUser =
          chat.type === ChatType.DIRECT ? targetChatUser?.user : undefined;

        return {
          ...chat,
          unreadMessagesCount: _count.messages,
          lastMessage: lastMessage,
          targetUser,
        };
      },
    );

    const hasMore = result.chats.length === pageSize + 1;
    const lastChat = result.chats.at(-1);
    const nextCursor = hasMore ? lastChat?.id : undefined;

    return {
      data: {
        ...result,
        chats: formattedChats,
        next: nextCursor,
      },
    };
  }

  async markMessagesAsRead({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }) {
    const chatMessagesToRead =
      await this.messagePrismaRepository.getUnreadMessageIdsByChat({
        chatId,
        userId,
      });

    const messageReadsToCreate = chatMessagesToRead.map((message) => ({
      messageId: message.id,
      userId,
    }));

    await this.messageReadPrismaRepository.create(messageReadsToCreate);

    return {
      data: {
        message: 'Success',
      },
    };
  }
}
