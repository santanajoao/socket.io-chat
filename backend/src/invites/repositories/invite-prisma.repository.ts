import { Injectable } from '@nestjs/common';
import { InviteRepository } from '../interfaces/invite-repository.interface';
import {
  CreateInviteRepositoryParams,
  CreateInviteRepositoryResponse,
} from '../dto/create-invite';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { ChatInviteModel } from '../models/chat-invite.model';
import {
  GetAllByUserIdRepositoryParams,
  GetAllByUserIdRepositoryResponse,
} from '../dto/get-all-by-user-id';

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

  async getAllByUserId({
    userId,
    limit,
    cursor,
  }: GetAllByUserIdRepositoryParams): Promise<GetAllByUserIdRepositoryResponse> {
    const userInvitesWhere = {
      OR: [
        {
          receiverUserId: userId,
        },
        {
          senderUserId: userId,
        },
      ],
    };

    const [invites, totalUnanswered] = await Promise.all([
      this.prismaDataSource.chatInvite.findMany({
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
        where: userInvitesWhere,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
      }),
      await this.prismaDataSource.chatInvite.count({
        where: {
          acceptedAt: null,
          receiverUserId: userId,
        },
      }),
    ]);

    return {
      invites,
      totalUnanswered,
    };
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

  async getUnansweredOrRejectedByChatId(
    chatId: string,
    userId: string,
  ): Promise<ChatInviteModel | null> {
    const data = await this.prismaDataSource.chatInvite.findFirst({
      where: {
        chatId,
        receiverUserId: userId,
        OR: [
          {
            acceptedAt: null,
          },
          {
            accepted: false,
          },
        ],
      },
    });

    return data;
  }
}
