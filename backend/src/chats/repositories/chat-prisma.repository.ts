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

@Injectable()
export class ChatPrismaRepository implements ChatRepository {
  constructor(
    private readonly prismaDataSource: PrismaDataSource,
    private readonly chatPrismaQueryBuilder: ChatPrismaQueryBuilder,
  ) {}

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

          groupChat: {
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

        cursor: ['', undefined].includes(cursor)
          ? undefined
          : {
              id: cursor,
            },

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
}
