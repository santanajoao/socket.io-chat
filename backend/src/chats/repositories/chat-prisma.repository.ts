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
import { CHAT_TYPE, ChatModel } from '../models/chat.model';
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
    const [messages, total] = await Promise.all([
      this.prismaDataSource.message.findMany({
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
          chat: {
            select: {
              id: true,
              type: true,
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
                          userId: userId,
                        },
                      },
                    },
                  },
                  chatUsers: true,
                },
              },
              group: {
                select: {
                  id: true,
                  groupType: true,
                  title: true,
                  createdByUser: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
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
          },
        },
        orderBy: {
          sentAt: 'desc',
        },
        distinct: ['chatId'],
        cursor: cursor !== undefined ? { id: cursor } : undefined,
        take: limit,
        where: {
          chat: {
            ...this.chatPrismaQueryBuilder.userChatsWhere({ userId }),
          },
        },
      }),

      this.prismaDataSource.chat.count({
        where: {
          ...this.chatPrismaQueryBuilder.userChatsWhere({ userId }),
        },
      }),
    ]);

    const formattedChats: ChatData[] = messages.map((message) => {
      return {
        ...message.chat,
        messages: [
          {
            id: message.id,
            content: message.content,
            sentAt: message.sentAt,
            user: message.user,
            chat: message.chat,
          },
        ],
      };
    });

    return { chats: formattedChats, total };
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
                    equals: params.userId,
                  },
                },
                messageReads: {
                  none: {
                    userId: params.userId,
                  },
                },
              },
            },
            chatUsers: true,
          },
        },
        group: {
          select: {
            id: true,
            groupType: true,
            title: true,
            createdByUser: {
              select: {
                id: true,
                username: true,
              },
            },
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
        id: params.chatId,
      },
    });

    return data;
  }

  async getChatById(id: string): Promise<ChatModel | null> {
    const data = this.prismaDataSource.chat.findUnique({
      where: {
        id,
      },
    });

    return data;
  }
}
