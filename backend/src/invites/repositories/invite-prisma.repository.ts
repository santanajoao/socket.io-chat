import { Injectable } from '@nestjs/common';
import { InviteRepository } from '../interfaces/invite-repository.interface';
import {
  CreateInviteRepositoryParams,
  CreateInviteRepositoryResponse,
} from '../dto/create-invite';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { ChatInviteModel } from '../models/chat-invite.model';

@Injectable()
export class InvitePrismaRepository
  extends PrismaRepository
  implements InviteRepository
{
  async create(
    params: CreateInviteRepositoryParams,
  ): Promise<CreateInviteRepositoryResponse> {
    const data = await this.prismaDataSource.chatInvite.create({
      select: {
        id: true,
        accepted: true,
        chat: {
          select: {
            id: true,
            group: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        senderUser: {
          select: {
            id: true,
            username: true,
          },
        },
        receiverUser: {
          select: {
            id: true,
            username: true,
          },
        },
        createdAt: true,
        acceptedAt: true,
      },
      data: {
        chatId: params.chatId,
        senderUserId: params.senderUserId,
        receiverUserId: params.receiverUserId,
      },
    });

    return data;
  }

  async getById(inviteId: string): Promise<ChatInviteModel | null> {
    const invite = await this.prismaDataSource.chatInvite.findUnique({
      where: {
        id: inviteId,
      },
    });

    return invite;
  }

  async getAllByUserId(
    userId: string,
  ): Promise<CreateInviteRepositoryResponse[]> {
    const invites = await this.prismaDataSource.chatInvite.findMany({
      select: {
        id: true,
        accepted: true,
        chat: {
          select: {
            id: true,
            group: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        senderUser: {
          select: {
            id: true,
            username: true,
          },
        },
        receiverUser: {
          select: {
            id: true,
            username: true,
          },
        },
        createdAt: true,
        acceptedAt: true,
      },
      where: {
        OR: [
          {
            receiverUserId: userId,
          },
          {
            senderUserId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invites;
  }

  async updateInvite(
    inviteId: string,
    data: Partial<ChatInviteModel>,
  ): Promise<void> {
    await this.prismaDataSource.chatInvite.update({
      where: {
        id: inviteId,
      },
      data,
    });
  }

  async getByChatIdAndUserId(
    chatId: string,
    userId: string,
  ): Promise<ChatInviteModel | null> {
    const data = await this.prismaDataSource.chatInvite.findFirst({
      where: {
        chatId,
        OR: [
          {
            receiverUserId: userId,
          },
          {
            senderUserId: userId,
          },
        ],
      },
    });

    return data;
  }
}
