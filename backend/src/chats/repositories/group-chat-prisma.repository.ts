import { Injectable } from '@nestjs/common';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { GroupChatRepository } from '../interfaces/grop-chat-repository.interface';
import { CreateGroupChatRepositoryParams } from '../dtos/create-group-chat';
import { GroupChat } from '../models/group-chat.model';

@Injectable()
export class GroupChatPrismaRepository
  extends PrismaRepository
  implements GroupChatRepository
{
  async createGroupChat(
    params: CreateGroupChatRepositoryParams,
  ): Promise<GroupChat> {
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
}
