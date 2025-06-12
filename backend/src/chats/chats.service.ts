import {
  BadRequestException,
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
import { GetChatUsersServiceParams } from './dtos/get-chat-users';
import { MarkMessagesAsReadServiceParams } from './dtos/mark-messages-as-read';
import {
  OnRemoveUserFromChatBody,
  RemoveUserFromChatServiceDto,
} from './dtos/remove-user-from-chat';
import { GetChatDetailsDto } from './dtos/get-chat-details';
import { UpdateAdminRightsServiceDto } from './dtos/grand-admin-rights';
import { MESSAGE_TYPE } from 'src/messages/models/message.model';
import { CursorPaginationFormatter } from 'src/shared/formatters/cursor-pagination.formatter';
import {
  OnChatGroupUpdateBody,
  UpdateChatGroupServiceParams,
} from './dtos/update-chat';
import { LeaveGroupChatServiceParams } from './dtos/leave-group-chat';

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
    const limit = pageSize + 1;
    const result = await this.chatRepository.getUserPaginatedChatList({
      userId,
      cursor,
      limit: limit,
    });

    const formatted = CursorPaginationFormatter.formatCursorPagination({
      data: result.chats,
      cursorColumn: 'id',
      pageSize: limit,
    });

    const formattedChats = formatted.data.map((chat) =>
      this.chatFormatter.formatChatData(chat),
    );

    return {
      data: {
        ...result,
        chats: formattedChats,
        next: formatted.next,
      },
    };
  }

  async markMessagesAsRead({
    chatId,
    userId,
  }: MarkMessagesAsReadServiceParams) {
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
    const { chat, groupChat, alertMessage } =
      await this.prismaTransaction.transaction(async () => {
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
              isAdmin: true,
            },
          ],
        });

        const alertMessage = await this.messageRepository.createMessage({
          chatId: chat.id,
          userId: params.userId,
          type: MESSAGE_TYPE.NEW_CHAT,
        });

        return { chat, groupChat, alertMessage };
      });

    const user = await this.userRepository.findById(params.userId);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const onCreateGroupChatBody: FormattedChatData = {
      ...chat,
      group: groupChat,
      type: CHAT_TYPE.GROUP,
      unreadMessagesCount: 0,
      lastMessage: {
        id: alertMessage.id,
        content: alertMessage.content,
        sentAt: alertMessage.sentAt,
        type: alertMessage.type,
        user,
      },
    };

    this.eventEmitter.emit(CHAT_EVENTS.MESSAGE_SEND, alertMessage);

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

  async getChatUsers(data: GetChatUsersServiceParams) {
    const limit = data.pageSize + 1;
    const chatUsers = await this.chatUsersRepository.getChatUsersPaginated({
      chatId: data.chatId,
      cursor: data.cursor,
      pageSize: limit,
      search: data.search,
    });

    const formattedUsers = chatUsers.users.map((chatUser) => {
      return {
        id: chatUser.user.id,
        username: chatUser.user.username,
        isAdmin: chatUser.user.chats?.[0]?.isAdmin,
      };
    });

    const formatted = CursorPaginationFormatter.formatCursorPagination({
      data: formattedUsers,
      cursorColumn: 'id',
      pageSize: limit,
    });

    return {
      data: {
        users: formatted.data,
        total: chatUsers.total,
        next: formatted.next,
      },
    };
  }

  async removeUserFromChat(data: RemoveUserFromChatServiceDto) {
    const senderChatUser = await this.chatUsersRepository.findByUserAndChat(
      data.requesterUserId,
      data.chatId,
    );

    if (!senderChatUser) {
      throw new UnauthorizedException('You are not in this chat');
    }

    if (!senderChatUser.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to remove users from this chat',
      );
    }

    const chatUser = await this.chatUsersRepository.findByUserAndChat(
      data.targetUserId,
      data.chatId,
    );

    if (!chatUser) {
      throw new BadRequestException('User not found in chat');
    }

    const { alertMessage } = await this.prismaTransaction.transaction(
      async () => {
        await this.chatUsersRepository.deleteChatUser(
          data.chatId,
          data.targetUserId,
        );

        const alertMessage = await this.messageRepository.createMessage({
          chatId: data.chatId,
          userId: data.targetUserId,
          type: MESSAGE_TYPE.USER_REMOVED,
        });

        return { alertMessage };
      },
    );

    const onRemoveUserFromChatBody: OnRemoveUserFromChatBody = {
      chatId: data.chatId,
      userId: data.targetUserId,
    };

    this.eventEmitter.emit(
      CHAT_EVENTS.CHAT_USER_REMOVE,
      onRemoveUserFromChatBody,
    );

    this.eventEmitter.emit(CHAT_EVENTS.MESSAGE_SEND, alertMessage);

    return {
      data: {
        chatId: data.chatId,
        userId: data.targetUserId,
      },
    };
  }

  async getChatDetails({ chatId, userId }: GetChatDetailsDto) {
    const chatDetails = await this.chatRepository.getChatDetailsById(chatId);
    if (!chatDetails) {
      throw new BadRequestException('Chat not found');
    }

    const chatUser = await this.chatUsersRepository.findByUserAndChat(
      userId,
      chatId,
    );
    if (!chatUser) {
      throw new UnauthorizedException('You are not in this chat');
    }

    const { _count, ...details } = chatDetails;
    const formattedChatDetails = {
      ...details,
      usersCount: _count.chatUsers,
      isAdmin: chatUser.isAdmin,
    };

    return {
      data: formattedChatDetails,
    };
  }

  async updateAdminRights(data: UpdateAdminRightsServiceDto) {
    const senderChatUser = await this.chatUsersRepository.findByUserAndChat(
      data.requesterUserId,
      data.chatId,
    );

    if (!senderChatUser) {
      throw new UnauthorizedException('You are not in this chat');
    }

    if (!senderChatUser.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to make admin actions in this chat',
      );
    }

    const chatUser = await this.chatUsersRepository.findByUserAndChat(
      data.targetUserId,
      data.chatId,
    );

    if (!chatUser) {
      throw new BadRequestException('User not found in chat');
    }

    const stateAlreadyUpdated = chatUser.isAdmin === data.isAdmin;
    if (stateAlreadyUpdated) {
      throw new BadRequestException(
        'Admin rights are already the same as requested',
      );
    }

    const updatedChatUser =
      await this.chatUsersRepository.updateByChatIdAndUserId(
        data.chatId,
        data.targetUserId,
        {
          isAdmin: data.isAdmin,
        },
      );

    this.eventEmitter.emit(CHAT_EVENTS.CHAT_ADMIN_RIGHT_UPDATE, {
      chatId: data.chatId,
      userId: data.targetUserId,
      isAdmin: data.isAdmin,
    });

    return {
      data: updatedChatUser,
    };
  }

  async updateChatGroup(data: UpdateChatGroupServiceParams) {
    const chatUser = await this.chatUsersRepository.findByUserAndChat(
      data.userId,
      data.chatId,
    );

    if (!chatUser) {
      throw new UnauthorizedException('You are not in this chat');
    }

    if (!chatUser.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to update this chat',
      );
    }

    const chat = await this.chatRepository.getChatById(data.chatId);
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }

    const updatedGroup = await this.groupChatRepository.updateGroupChat(
      data.chatId,
      {
        title: data.title,
      },
    );

    const response: OnChatGroupUpdateBody = {
      chatId: data.chatId,
      group: updatedGroup,
    };

    this.eventEmitter.emit(CHAT_EVENTS.CHAT_GROUP_UPDATE, response);

    return {
      data: {
        ...chat,
        group: updatedGroup,
      },
    };
  }

  async leaveGroupChat({ chatId, userId }: LeaveGroupChatServiceParams) {
    const chatUser = await this.chatUsersRepository.findByUserAndChat(
      userId,
      chatId,
    );

    if (!chatUser) {
      throw new UnauthorizedException('You are not in this chat');
    }

    const groupChat = await this.groupChatRepository.getByChatId(chatId);
    if (!groupChat) {
      throw new BadRequestException('This chat is not a group');
    }

    const userCounts = await this.chatUsersRepository.countChatUsers(chatId);
    const hasOnlyOneUser = userCounts.total === 1;

    if (hasOnlyOneUser) {
      await this.chatRepository.deleteChatById(chatId);
    } else {
      const userIsOnlyAdmin = userCounts.adminCount > 1;
      if (chatUser.isAdmin && userIsOnlyAdmin) {
        throw new BadRequestException(
          'You are the only admin in this group. Please assign admin rights to another member before leaving the chat.',
        );
      }

      const { alertMessage } = await this.prismaTransaction.transaction(
        async () => {
          await this.chatUsersRepository.deleteChatUser(chatId, userId);

          const alertMessage = await this.messageRepository.createMessage({
            chatId: chatId,
            userId: userId,
            type: MESSAGE_TYPE.CHAT_LEAVE,
          });

          return { alertMessage };
        },
      );

      this.eventEmitter.emit(CHAT_EVENTS.MESSAGE_SEND, alertMessage);
    }

    const onChatUserRemoveBody: OnRemoveUserFromChatBody = {
      chatId,
      userId,
    };

    this.eventEmitter.emit(CHAT_EVENTS.CHAT_USER_REMOVE, onChatUserRemoveBody);

    return {
      data: {
        chatId,
        userId,
      },
    };
  }
}
