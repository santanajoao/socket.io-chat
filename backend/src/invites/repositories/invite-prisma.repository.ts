import { Injectable } from '@nestjs/common';
import { InviteRepository } from '../interfaces/invite-repository.interface';
import {
  CreateInviteRepositoryParams,
  CreateInviteRepositoryResponse,
} from '../dto/create-invite';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { ChatInvite } from 'generated/prisma';

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

  async getById(inviteId: string): Promise<ChatInvite | null> {
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
    });

    return invites;
  }

  async updateInvite(
    inviteId: string,
    data: Partial<ChatInvite>,
  ): Promise<void> {
    console.log(data);
    await this.prismaDataSource.chatInvite.update({
      where: {
        id: inviteId,
      },
      data,
    });
  }
}
