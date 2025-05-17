import { AddUsersToChatRepositoryParams } from '../dtos/add-users-to-chat';
import { ChatUsersRepository } from '../interfaces/chat-users-repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';

@Injectable()
export class ChatUsersPrismaRepository
  extends PrismaRepository
  implements ChatUsersRepository
{
  async addUsersToChat(params: AddUsersToChatRepositoryParams) {
    const result = await this.prismaDataSource.chatUser.createMany({
      data: params.data,
    });

    return result;
  }
}
