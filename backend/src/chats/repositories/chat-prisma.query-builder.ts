import { Injectable } from '@nestjs/common';
import { GroupType, Prisma } from 'generated/prisma';
import { UserChatsWhereParams } from '../dtos/chat-query-builder';

@Injectable()
export class ChatPrismaQueryBuilder {
  userChatsWhere({ userId }: UserChatsWhereParams): Prisma.ChatWhereInput {
    return {
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
    };
  }
}
