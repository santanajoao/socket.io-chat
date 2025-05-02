import { Injectable } from '@nestjs/common';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';
import { GetUserPaginatedChatListServiceParams } from './dtos/get-user-paginated-chat-list';
import { GetAllUserChatIdsParams } from './dtos/get-all-user-chat-ids';

@Injectable()
export class ChatsService {
  constructor(private readonly chatPrismaRepository: ChatPrismaRepository) {}

  async getAllUserChatIds({ userId }: GetAllUserChatIdsParams) {
    return this.chatPrismaRepository.getAllUserChatIds({ userId });
  }

  async getUserPaginatedChatList({
    userId,
    cursor,
    pageSize: limit,
  }: GetUserPaginatedChatListServiceParams) {
    const result = await this.chatPrismaRepository.getUserPaginatedChatList({
      userId,
      cursor,
      limit: limit + 1,
    });

    const requestedChats = result.chats.slice(0, limit);
    const hasMore = result.chats.length === limit + 1;

    const lastChat = result.chats.at(-1);
    const nextCursor = hasMore ? lastChat?.id : undefined;

    return {
      data: {
        ...result,
        chats: requestedChats,
        next: nextCursor,
      },
    };
  }
}
