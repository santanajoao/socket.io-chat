import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InvitePrismaRepository } from './repositories/invite-prisma.repository';
import {
  OnInviteResponseBody,
  RespondInviteServiceParams,
} from './dto/respond-invite';
import { ChatUsersPrismaRepository } from 'src/chats/repositories/chat-users-prisma.repository';
import { PrismaTransaction } from 'src/shared/repositories/prisma-transaction';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatPrismaRepository } from 'src/chats/repositories/chat-prisma.repository';
import { FormattedChatData } from 'src/chats/dtos/get-user-paginated-chat-list';
import { ChatFormatter } from 'src/chats/formatters/chat.formatter';

@Injectable()
export class InvitesService {
  constructor(
    private readonly inviteRepository: InvitePrismaRepository,
    private readonly chatUsersRepository: ChatUsersPrismaRepository,
    private readonly chatRepository: ChatPrismaRepository,
    private readonly chatFormatter: ChatFormatter,
    private readonly prismaTransaction: PrismaTransaction,
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

    const nowDate = new Date();

    await this.prismaTransaction.transaction(async () => {
      if (data.accept) {
        await this.chatUsersRepository.addUsersToChat({
          data: [
            {
              chatId: invite.chatId,
              userId: data.userId,
            },
            {
              chatId: invite.chatId,
              userId: invite.senderUserId,
            },
          ],
        });
      }

      await this.inviteRepository.updateInvite(data.inviteId, {
        accepted: data.accept,
        acceptedAt: nowDate,
      });
    });

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
        userId: data.userId,
      });
    }

    const inviteResponseBody: OnInviteResponseBody = {
      invite: {
        id: invite.id,
        accepted: data.accept,
        senderUserId: invite.senderUserId,
        receiverUserId: invite.receiverUserId,
        acceptedAt: nowDate,
      },
      chat: formattedChat!,
    };

    this.eventEmitter.emit('invite:response', inviteResponseBody);

    return {
      data: inviteResponseBody,
    };
  }
}
