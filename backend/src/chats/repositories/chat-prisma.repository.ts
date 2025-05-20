import { Injectable } from '@nestjs/common';
import { PrismaDataSource } from 'src/shared/datasources/prisma.datasource';
import { ChatRepository } from '../interfaces/chat-repository.interface';
import {
  GetAllUserChatIdsParams,
  GetAllUserChatIdsResponse,
} from '../dtos/get-all-user-chat-ids';
import {
  ChatData,
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
import { CHAT_TYPE } from '../models/chat.model';
import { GetUserChatByIdParams } from '../dtos/get-user-chat';

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
        select: this.chatPrismaQueryBuilder.userChatsSelect({
          userId,
        }),
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
        type: CHAT_TYPE.DIRECT,
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

  async getUserChatById(
    params: GetUserChatByIdParams,
  ): Promise<ChatData | null> {
    const data = await this.prismaDataSource.chat.findUnique({
      select: this.chatPrismaQueryBuilder.userChatsSelect({
        userId: params.userId,
      }),
      where: {
        id: params.chatId,
      },
    });

    return data;
  }
}
