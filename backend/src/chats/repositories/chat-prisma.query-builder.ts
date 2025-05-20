import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import {
  UserChatsSelectParams,
  UserChatsWhereParams,
} from '../dtos/chat-query-builder';
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

  userChatsSelect({ userId }: UserChatsSelectParams) {
    const select = {
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
        },
      },
      group: {
        select: {
          id: true,
          groupType: true,
          title: true,
          createdByUserId: true,
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
    } as const;

    return select;
  }
}
