import { Injectable } from '@nestjs/common';
import { PrismaDataSource } from 'src/shared/datasources/prisma.datasource';
import { ChatRepository } from '../interfaces/chat-repository.interface';
import {
  GetAllUserChatIdsParams,
  GetAllUserChatIdsResponse,
} from '../dtos/get-all-user-chat-ids';
import {
  GetUserPaginatedChatListRepositoryParams,
  GetUserPaginatedChatListResponse,
} from '../dtos/get-user-paginated-chat-list';
import { ChatPrismaQueryBuilder } from './chat-prisma.query-builder';
import {
  CreateChatRepositoryParams,
  CreateChatRepositoryResponse,
} from '../dtos/create-chat';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { GetDirectChatByUserIdsParams } from '../interfaces/get-chat-by-type-and-users';
import { ChatType } from 'generated/prisma';

@Injectable()
export class ChatPrismaRepository
  extends PrismaRepository
  implements ChatRepository
{
  constructor(
    prismaDataSource: PrismaDataSource,
    private readonly chatPrismaQueryBuilder: ChatPrismaQueryBuilder,
  ) {
    super(prismaDataSource);
  }

  async getAllUserChatIds({
    userId,
  }: GetAllUserChatIdsParams): Promise<GetAllUserChatIdsResponse> {
    const allUserChats = await this.prismaDataSource.chat.findMany({
      select: {
        id: true,
      },
      where: {
        ...this.chatPrismaQueryBuilder.userChatsWhere({ userId }),
      },
    });

    return allUserChats;
  }

  async getUserPaginatedChatList({
    userId,
    cursor,
    limit,
  }: GetUserPaginatedChatListRepositoryParams): Promise<GetUserPaginatedChatListResponse> {
    const [chats, total] = await Promise.all([
      this.prismaDataSource.chat.findMany({
        select: {
          id: true,
          type: true,
          messages: {
            select: {
              id: true,
              content: true,
              sentAt: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
            orderBy: {
              sentAt: 'desc',
            },
            take: 1,
          },
          _count: {
            select: {
              messages: {
                where: {
                  userId: {
                    not: {
                      equals: userId,
                    },
                  },
                  messageReads: {
                    none: {
                      userId,
                    },
                  },
                },
              },
            },
          },
          group: {
            select: {
              id: true,
              groupType: true,
              title: true,
            },
          },
          chatUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
            take: 2,
          },
        },
        where: {
          ...this.chatPrismaQueryBuilder.userChatsWhere({ userId }),
        },
        orderBy: {
          id: 'asc',
        },
        cursor: cursor !== undefined ? { id: cursor } : undefined,
        take: limit,
      }),

      this.prismaDataSource.chat.count({
        where: {
          ...this.chatPrismaQueryBuilder.userChatsWhere({ userId }),
        },
      }),
    ]);

    return { chats, total };
  }

  async createChat(
    param: CreateChatRepositoryParams,
  ): Promise<CreateChatRepositoryResponse> {
    const data = await this.prismaDataSource.chat.create({
      select: {
        id: true,
      },
      data: {
        type: param.type,
      },
    });

    return data;
  }

  async getDirectChatByUserIds(
    params: GetDirectChatByUserIdsParams,
  ): Promise<unknown> {
    const data = await this.prismaDataSource.chat.findFirst({
      select: {
        id: true,
      },
      where: {
        type: ChatType.DIRECT,
        chatUsers: {
          every: {
            userId: {
              in: [params.firstUserId, params.secondUserId],
            },
          },
        },
      },
    });

    return data;
  }
}
