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

@Injectable()
export class InvitesService {
  constructor(
    private readonly inviteRepository: InvitePrismaRepository,
    private readonly chatUsersRepository: ChatUsersPrismaRepository,
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

    const inviteResponseBody: OnInviteResponseBody = {
      inviteId: invite.id,
      accepted: data.accept,
      senderUserId: invite.senderUserId,
      acceptedAt: nowDate,
    };

    this.eventEmitter.emit('invite:response', inviteResponseBody);

    return {
      data: inviteResponseBody,
    };
  }
}
