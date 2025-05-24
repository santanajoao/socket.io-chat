import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { UserChatsWhereParams } from '../dtos/chat-query-builder';
import { GROUP_TYPE } from '../models/group-chat.model';

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
          group: {
            groupType: GROUP_TYPE.GLOBAL,
          },
        },
      ],
    };
  }
}
