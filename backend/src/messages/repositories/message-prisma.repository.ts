import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../interfaces/message-repository.interface';
import {
  GetChatMessagesRepositoryParams,
  GetChatMessagesResponse,
} from '../dtos/get-chat-messages';
import { CreateMessageRepositoryParams } from '../dtos/create-message';
import {
  GetUnreadMessagesByChatParams,
  UnreadMessage,
} from '../dtos/get-unread-messages-by-chat';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';

@Injectable()
export class MessagePrismaRepository
  extends PrismaRepository
  implements MessageRepository
{
  async getMessagesByChat(
    params: GetChatMessagesRepositoryParams,
  ): Promise<GetChatMessagesResponse> {
    const [messages, total] = await Promise.all([
      this.prismaDataSource.message.findMany({
        select: {
          id: true,
          content: true,
          sentAt: true,
          type: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          messageReads: {
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        where: {
          chatId: params.chatId,
        },
        orderBy: {
          sentAt: 'desc',
        },
        cursor: params.cursor ? { id: params.cursor } : undefined,
        take: params.limit,
      }),

      this.prismaDataSource.message.count({
        where: {
          chatId: params.chatId,
        },
      }),
    ]);

    return { messages, total };
  }

  async createMessage(params: CreateMessageRepositoryParams) {
    const message = await this.prismaDataSource.message.create({
      select: {
        id: true,
        content: true,
        sentAt: true,
        type: true,
        chatId: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      data: {
        chatId: params.chatId,
        content: params.content,
        userId: params.userId,
        type: params.type,
      },
    });

    return message;
  }

  async getUnreadMessageIdsByChat(
    params: GetUnreadMessagesByChatParams,
  ): Promise<UnreadMessage[]> {
    const messages = await this.prismaDataSource.message.findMany({
      select: {
        id: true,
      },
      where: {
        chatId: params.chatId,
        userId: {
          not: {
            equals: params.userId,
          },
        },
        messageReads: {
          none: {
            userId: params.userId,
          },
        },
      },
    });

    return messages;
  }
}
