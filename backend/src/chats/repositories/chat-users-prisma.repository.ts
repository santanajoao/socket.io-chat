import { AddUsersToChatRepositoryParams } from '../dtos/add-users-to-chat';
import { ChatUsersRepository } from '../interfaces/chat-users-repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { ChatUser } from '../models/chat-user.model';

@Injectable()
export class ChatUsersPrismaRepository
  extends PrismaRepository
  implements ChatUsersRepository
{
  async addUsersToChat(
    params: AddUsersToChatRepositoryParams,
  ): Promise<ChatUser[]> {
    const result = await this.prismaDataSource.chatUser.createManyAndReturn({
      data: params.data,
    });

    return result;
  }

  findByUserAndChat(userId: string, chatId: string): Promise<ChatUser | null> {
    return this.prismaDataSource.chatUser.findFirst({
      where: {
        chatId,
        userId,
      },
    });
  }

  findByChatAndUsers(chatId: string, userIds: string[]): Promise<ChatUser[]> {
    return this.prismaDataSource.chatUser.findMany({
      where: {
        chatId,
        userId: {
          in: userIds,
        },
      },
    });
  }
}
