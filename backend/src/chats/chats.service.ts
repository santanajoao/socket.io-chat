import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';
import {
  FormattedChatData,
  GetUserPaginatedChatListServiceParams,
} from './dtos/get-user-paginated-chat-list';
import { GetAllUserChatIdsParams } from './dtos/get-all-user-chat-ids';
import { MessagePrismaRepository } from 'src/messages/repositories/message-prisma.repository';
import { MessageReadPrismaRepository } from 'src/messages/repositories/message-read-prisma.repository';
import { CreateChatServiceParams } from './dtos/create-chat';
import { UserPrismaRepository } from 'src/users/repositories/user-prisma.repository';
import { ChatUsersPrismaRepository } from './repositories/chat-users-prisma.repository';
import { InvitePrismaRepository } from 'src/invites/repositories/invite-prisma.repository';
import { PrismaTransaction } from 'src/shared/repositories/prisma-transaction';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CHAT_EVENTS } from './constants/events';
import { CreateGroupChatServiceParams } from './dtos/create-group-chat';
import { CHAT_TYPE } from './models/chat.model';
import { GroupChatPrismaRepository } from './repositories/group-chat-prisma.repository';
import { GROUP_TYPE } from './models/group-chat.model';
import { AuthorizeJoinChatServiceParams } from './dtos/join-chat';
import { ChatFormatter } from './formatters/chat.formatter';
import { OnChatInviteBody } from 'src/invites/dto/create-invite';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatPrismaRepository,
    private readonly messageRepository: MessagePrismaRepository,
    private readonly messageReadRepository: MessageReadPrismaRepository,
    private readonly userRepository: UserPrismaRepository,
    private readonly chatUsersRepository: ChatUsersPrismaRepository,
    private readonly inviteRepository: InvitePrismaRepository,
    private readonly groupChatRepository: GroupChatPrismaRepository,
    private readonly prismaTransaction: PrismaTransaction,
    private readonly eventEmitter: EventEmitter2,
    private readonly chatFormatter: ChatFormatter,
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
    const formattedChats = requestedChats.map((chat) =>
      this.chatFormatter.formatChatData(chat),
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

    const { invite } = await this.prismaTransaction.transaction(async () => {
      const chat = await this.chatRepository.createChat({
        type: CHAT_TYPE.DIRECT,
      });

      const invite = await this.inviteRepository.create({
        chatId: chat.id,
        senderUserId: params.senderId,
        receiverUserId: receiverUser.id,
      });

      return { invite };
    });

    const onChatInviteBody: OnChatInviteBody = {
      invite: invite,
      receiverUserId: receiverUser.id,
    };

    this.eventEmitter.emit(CHAT_EVENTS.CHAT_INVITE, onChatInviteBody);

    return {
      data: {
        invite,
      },
    };
  }

  async createGroupChat(params: CreateGroupChatServiceParams) {
    const { chat, groupChat } = await this.prismaTransaction.transaction(
      async () => {
        const chat = await this.chatRepository.createChat({
          type: CHAT_TYPE.GROUP,
        });

        const groupChat = await this.groupChatRepository.createGroupChat({
          title: params.name,
          chatId: chat.id,
          createdByUserId: params.userId,
          groupType: GROUP_TYPE.PRIVATE,
        });

        await this.chatUsersRepository.addUsersToChat({
          data: [
            {
              chatId: chat.id,
              userId: params.userId,
            },
          ],
        });

        return { chat, groupChat };
      },
    );

    const onCreateGroupChatBody: FormattedChatData = {
      ...chat,
      group: groupChat,
      type: CHAT_TYPE.GROUP,
      unreadMessagesCount: 0,
      lastMessage: null,
      usersCount: 1,
    };

    return {
      data: onCreateGroupChatBody,
    };
  }

  async authorizeJoinChat(data: AuthorizeJoinChatServiceParams) {
    const chatUser = await this.chatUsersRepository.findByUserAndChat(
      data.userId,
      data.chatId,
    );

    if (!chatUser) {
      throw new UnauthorizedException(
        'You are not authorized to join this chat',
      );
    }

    return {
      data: {
        authorized: true,
      },
    };
  }
}
