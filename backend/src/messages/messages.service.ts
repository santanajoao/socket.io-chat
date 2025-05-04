import { Injectable } from '@nestjs/common';
import { GetChatMessagesServiceParams } from './dtos/get-chat-messages';
import { MessagePrismaRepository } from './repositories/message-prisma.repository';
import { CreateMessageServiceParams } from './dtos/create-message';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagePrismaRepository: MessagePrismaRepository,
  ) {}

  async getChatMessages({
    chatId,
    pageSize,
    cursor,
  }: GetChatMessagesServiceParams) {
    const result = await this.messagePrismaRepository.getMessagesByChat({
      chatId,
      limit: pageSize + 1,
      cursor,
    });

    const requestedMessages = result.messages.slice(0, pageSize);

    const lastMessage = result.messages.at(-1);
    const hasMore = requestedMessages.length === pageSize + 1;
    const nextCursor = hasMore ? lastMessage?.id : undefined;

    return {
      data: {
        messages: requestedMessages,
        nextCursor,
        total: result.total,
      },
    };
  }

  async createMessage({ chatId, userId, content }: CreateMessageServiceParams) {
    const message = await this.messagePrismaRepository.createMessage({
      chatId,
      userId,
      content,
    });

    return {
      data: message,
    };
  }
}
