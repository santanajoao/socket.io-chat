import { AddUsersToChatRepositoryParams } from '../dtos/add-users-to-chat';
import { ChatUsersRepository } from '../interfaces/chat-users-repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { ChatUserModel } from '../models/chat-user.model';
import { GetChatUsersPaginatedRepositoryParams } from '../dtos/get-chat-users';

@Injectable()
export class ChatUsersPrismaRepository
  extends PrismaRepository
  implements ChatUsersRepository
{
  async addUsersToChat(
    params: AddUsersToChatRepositoryParams,
  ): Promise<ChatUserModel[]> {
    const result = await this.prismaDataSource.chatUser.createManyAndReturn({
      data: params.data,
    });

    return result;
  }

  findByUserAndChat(
    userId: string,
    chatId: string,
  ): Promise<ChatUserModel | null> {
    return this.prismaDataSource.chatUser.findFirst({
      where: {
        chatId,
        userId,
      },
    });
  }

  findByChatAndUsers(
    chatId: string,
    userIds: string[],
  ): Promise<ChatUserModel[]> {
    return this.prismaDataSource.chatUser.findMany({
      where: {
        chatId,
        userId: {
          in: userIds,
        },
      },
    });
  }

  async getChatUsersPaginated({
    chatId,
    cursor,
    pageSize,
    search,
  }: GetChatUsersPaginatedRepositoryParams) {
    const [users, total] = await Promise.all([
      this.prismaDataSource.chatUser.findMany({
        select: {
          user: {
            select: {
              id: true,
              username: true,
              chats: {
                select: {
                  chatId: true,
                  isAdmin: true,
                },
                where: {
                  chatId,
                },
              },
            },
          },
        },
        where: {
          chatId,
          user: search
            ? {
                username: {
                  contains: search,
                  mode: 'insensitive',
                },
              }
            : undefined,
        },
        take: pageSize,
        cursor: cursor
          ? {
              chatId_userId: {
                chatId,
                userId: cursor,
              },
            }
          : undefined,
        orderBy: {
          joinedAt: 'desc',
        },
      }),
      this.prismaDataSource.chatUser.count({
        where: {
          chatId,
        },
      }),
    ]);

    return {
      users,
      total,
    };
  }

  async deleteChatUser(chatId: string, userId: string): Promise<void> {
    await this.prismaDataSource.chatUser.deleteMany({
      where: {
        chatId,
        userId,
      },
    });
  }
}
