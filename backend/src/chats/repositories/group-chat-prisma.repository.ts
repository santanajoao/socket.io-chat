import { Injectable } from '@nestjs/common';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { GroupChatRepository } from '../interfaces/grop-chat-repository.interface';
import {
  CreateGroupChatRepositoryParams,
  CreateGroupChatRepositoryResponse,
} from '../dtos/create-group-chat';
import { UpdateChatGroupRepositoryParams } from '../dtos/update-chat';

@Injectable()
export class GroupChatPrismaRepository
  extends PrismaRepository
  implements GroupChatRepository
{
  async createGroupChat(
    params: CreateGroupChatRepositoryParams,
  ): Promise<CreateGroupChatRepositoryResponse> {
    const data = await this.prismaDataSource.groupChat.create({
      data: {
        title: params.title,
        chatId: params.chatId,
        groupType: params.groupType,
        createdByUserId: params.createdByUserId,
      },
    });

    return data;
  }

  async updateGroupChat(chatId: string, data: UpdateChatGroupRepositoryParams) {
    const updatedChat = await this.prismaDataSource.groupChat.update({
      where: { chatId },
      data: {
        title: data.title,
      },
    });

    return updatedChat;
  }
}
