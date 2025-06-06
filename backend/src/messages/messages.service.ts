import { Injectable } from '@nestjs/common';
import { GetChatMessagesServiceParams } from './dtos/get-chat-messages';
import { MessagePrismaRepository } from './repositories/message-prisma.repository';
import { CreateMessageServiceParams } from './dtos/create-message';
import { MESSAGE_TYPE } from './models/message.model';
import { CursorPaginationFormatter } from 'src/shared/formatters/cursor-pagination.formatter';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessagePrismaRepository) {}

  async getChatMessages({
    chatId,
    pageSize,
    cursor,
  }: GetChatMessagesServiceParams) {
    const limit = pageSize + 1;
    const result = await this.messageRepository.getMessagesByChat({
      chatId,
      limit: limit,
      cursor,
    });

    const formatted = CursorPaginationFormatter.formatCursorPagination(
      result.messages,
      'id',
      limit,
    );

    return {
      data: {
        messages: formatted.data,
        next: formatted.next,
        total: result.total,
      },
    };
  }

  async createMessage({ chatId, userId, content }: CreateMessageServiceParams) {
    const message = await this.messageRepository.createMessage({
      chatId,
      userId,
      content,
      type: MESSAGE_TYPE.DEFAULT,
    });

    return {
      data: message,
    };
  }
}
