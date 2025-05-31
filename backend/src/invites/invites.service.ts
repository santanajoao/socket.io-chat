import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InvitePrismaRepository } from './repositories/invite-prisma.repository';
import {
  OnInviteResponseBody,
  RespondInviteServiceParams,
} from './dto/respond-invite';
import { ChatUsersPrismaRepository } from 'src/chats/repositories/chat-users-prisma.repository';
import { PrismaTransaction } from 'src/shared/repositories/prisma-transaction';
import { ChatPrismaRepository } from 'src/chats/repositories/chat-prisma.repository';
import { FormattedChatData } from 'src/chats/dtos/get-user-paginated-chat-list';
import { ChatFormatter } from 'src/chats/formatters/chat.formatter';
import { CreateGroupInviteServiceParams } from './dto/create-group-invite';
import { UserPrismaRepository } from 'src/users/repositories/user-prisma.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CHAT_EVENTS } from 'src/chats/constants/events';
import { OnChatInviteBody } from './dto/create-invite';
import { CHAT_TYPE } from 'src/chats/models/chat.model';

@Injectable()
export class InvitesService {
  constructor(
    private readonly inviteRepository: InvitePrismaRepository,
    private readonly chatUsersRepository: ChatUsersPrismaRepository,
    private readonly chatRepository: ChatPrismaRepository,
    private readonly chatFormatter: ChatFormatter,
    private readonly prismaTransaction: PrismaTransaction,
    private readonly userRepository: UserPrismaRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAllUserInvites(userId: string) {
    const invites = await this.inviteRepository.getAllByUserId(userId);

    return {
      data: invites,
    };
  }

  async respondInvite(data: RespondInviteServiceParams) {
    const invite = await this.inviteRepository.getById(data.inviteId);
    if (!invite) {
      throw new BadRequestException('Invite not found');
    }

    if (invite.receiverUserId !== data.userId) {
      throw new UnauthorizedException('You cannot respond to this invite');
    }

    if (invite.acceptedAt) {
      throw new BadRequestException('Invite already responded');
    }

    const chat = await this.chatRepository.getChatById(invite.chatId);
    if (!chat) {
      throw new InternalServerErrorException('Chat not found');
    }

    const usersToAdd = [{ chatId: invite.chatId, userId: data.userId }];
    if (chat.type === CHAT_TYPE.DIRECT) {
      usersToAdd.push({
        chatId: invite.chatId,
        userId: invite.senderUserId,
      });
    }

    const nowDate = new Date();

    await this.prismaTransaction.transaction(async () => {
      if (data.accept) {
        await this.chatUsersRepository.addUsersToChat({
          data: usersToAdd,
        });
      }

      await this.inviteRepository.updateInvite(data.inviteId, {
        accepted: data.accept,
        acceptedAt: nowDate,
      });
    });

    const receiverUser = await this.userRepository.findById(
      invite.receiverUserId,
    );

    let formattedChat: FormattedChatData | null = null;

    if (data.accept) {
      const chatData = await this.chatRepository.getUserChatById({
        chatId: invite.chatId,
        userId: data.userId,
      });

      if (!chatData) {
        throw new BadRequestException('Chat not found');
      }

      formattedChat = this.chatFormatter.formatChatData({
        ...chatData,
      });
    }

    const userIdsToEmitNewChat = usersToAdd.map((user) => user.userId);
    const inviteResponseBody: OnInviteResponseBody = {
      invite: {
        id: invite.id,
        accepted: data.accept,
        senderUserId: invite.senderUserId,
        receiverUser: receiverUser!,
        acceptedAt: nowDate,
        chatId: invite.chatId,
      },
      chat: formattedChat!,
      userIdsToEmitNewChat,
    };

    return {
      data: inviteResponseBody,
    };
  }

  async createGroupInvite(data: CreateGroupInviteServiceParams) {
    const chat = await this.chatRepository.getChatById(data.chatId);
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }

    const senderChatUser = await this.chatUsersRepository.findByUserAndChat(
      data.senderUserId,
      data.chatId,
    );

    if (!senderChatUser) {
      throw new UnauthorizedException('You are not in this chat');
    }

    if (!senderChatUser.isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to invite users to this chat',
      );
    }

    const user = await this.userRepository.findByEmail(data.receiverEmail);
    if (!user) {
      throw new BadRequestException('No user found with this email');
    }

    const receiverChatUser = await this.chatUsersRepository.findByUserAndChat(
      user.id,
      data.chatId,
    );

    if (receiverChatUser) {
      throw new BadRequestException(
        'The user you are inviting is already in the chat',
      );
    }

    const existingInvite = await this.inviteRepository.getByChatIdAndUserId(
      data.chatId,
      user.id,
    );
    if (existingInvite) {
      throw new BadRequestException(
        'You have already invited this user to this chat',
      );
    }

    const createdInvite = await this.inviteRepository.create({
      chatId: data.chatId,
      senderUserId: data.senderUserId,
      receiverUserId: user.id,
    });

    const onChatInviteBody: OnChatInviteBody = {
      invite: createdInvite,
      receiverUserId: user.id,
    };

    this.eventEmitter.emit(CHAT_EVENTS.CHAT_INVITE, onChatInviteBody);

    return {
      data: createdInvite,
    };
  }
}
