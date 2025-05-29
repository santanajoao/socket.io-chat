import { Injectable } from '@nestjs/common';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { GroupChatRepository } from '../interfaces/grop-chat-repository.interface';
import {
  CreateGroupChatRepositoryParams,
  CreateGroupChatRepositoryResponse,
} from '../dtos/create-group-chat';

@Injectable()
export class GroupChatPrismaRepository
  extends PrismaRepository
  implements GroupChatRepository
{
  async createGroupChat(
    params: CreateGroupChatRepositoryParams,
  ): Promise<CreateGroupChatRepositoryResponse> {
    const data = await this.prismaDataSource.groupChat.create({
      include: {
        createdByUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      data: {
        title: params.title,
        chatId: params.chatId,
        groupType: params.groupType,
        createdByUserId: params.createdByUserId,
      },
    });

    return data;
  }
}
