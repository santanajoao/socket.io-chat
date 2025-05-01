import { Injectable } from '@nestjs/common';
import { PrismaDataSource } from 'src/shared/datasources/prisma.datasource';
import { ChatRepository } from '../interfaces/chat-repository.interface';
import {
  GetAllByUserIdParams,
  GetAllByUserIdResponse,
} from '../dtos/get-all-by-user-id';
import { GroupType } from 'generated/prisma';

@Injectable()
export class ChatPrismaRepository implements ChatRepository {
  constructor(private readonly prismaDataSource: PrismaDataSource) {}

  async getAllUserChatIds({
    userId,
  }: GetAllByUserIdParams): Promise<GetAllByUserIdResponse> {
    const allUserChats = await this.prismaDataSource.chat.findMany({
      select: {
        id: true,
      },
      where: {
        OR: [
          {
            chatUsers: {
              some: {
                userId,
              },
            },
          },
          {
            groupChat: {
              groupType: GroupType.GLOBAL,
            },
          },
        ],
      },
    });

    return allUserChats;
  }
}
