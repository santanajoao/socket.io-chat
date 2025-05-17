import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';
import { GetUserPaginatedChatListServiceParams } from './dtos/get-user-paginated-chat-list';
import { GetAllUserChatIdsParams } from './dtos/get-all-user-chat-ids';
import { ChatType } from 'generated/prisma';
import { MessagePrismaRepository } from 'src/messages/repositories/message-prisma.repository';
import { MessageReadPrismaRepository } from 'src/messages/repositories/message-read-prisma.repository';
import { CreateChatServiceParams } from './dtos/create-chat';
import { UserPrismaRepository } from 'src/users/repositories/user-prisma.repository';
import { ChatUsersPrismaRepository } from './repositories/chat-users-prisma.repository';
import { InvitePrismaRepository } from 'src/invites/repositories/invite-prisma.repository';
import { PrismaTransaction } from 'src/shared/repositories/prisma-transaction';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CHAT_EVENTS } from './constants/events';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatPrismaRepository,
    private readonly messageRepository: MessagePrismaRepository,
    private readonly messageReadRepository: MessageReadPrismaRepository,
    private readonly userRepository: UserPrismaRepository,
    private readonly chatUsersRepository: ChatUsersPrismaRepository,
    private readonly inviteRepository: InvitePrismaRepository,
    private readonly prismaTransaction: PrismaTransaction,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAllUserChatIds({ userId }: GetAllUserChatIdsParams) {
    return this.chatRepository.getAllUserChatIds({ userId });
  }

  async getUserPaginatedChatList({
    userId,
    cursor,
    pageSize,
  }: GetUserPaginatedChatListServiceParams) {
    const result = await this.chatRepository.getUserPaginatedChatList({
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
      await this.messageRepository.getUnreadMessageIdsByChat({
        chatId,
        userId,
      });

    const messageReadsToCreate = chatMessagesToRead.map((message) => ({
      messageId: message.id,
      userId,
    }));

    await this.messageReadRepository.create(messageReadsToCreate);

    return {
      data: {
        message: 'Success',
      },
    };
  }

  async createDirectChat(params: CreateChatServiceParams) {
    const receiverUser = await this.userRepository.findByEmail(
      params.receiverEmail,
    );

    if (!receiverUser) {
      throw new UnprocessableEntityException('No user found with this email');
    }

    if (receiverUser.id === params.senderId) {
      throw new UnprocessableEntityException(
        'You cannot create a chat with yourself',
      );
    }

    const existingDirectChat = await this.chatRepository.getDirectChatByUserIds(
      {
        firstUserId: params.senderId,
        secondUserId: receiverUser.id,
      },
    );

    if (existingDirectChat) {
      throw new UnprocessableEntityException(
        'You already have a chat with this user',
      );
    }

    // adicionar usuários ao chat apenas quando o outro aceitar o convite
    const { invite } = await this.prismaTransaction.transaction(async () => {
      const chat = await this.chatRepository.createChat({
        type: ChatType.DIRECT,
      });

      const invite = await this.inviteRepository.create({
        chatId: chat.id,
        senderUserId: params.senderId,
        receiverUserId: receiverUser.id,
      });

      return { invite };
    });

    this.eventEmitter.emit(CHAT_EVENTS.CREATED_DIRECT_CHAT, {
      invite,
      receiverUser,
    });

    return {
      data: {
        invite,
      },
    };
  }
}
