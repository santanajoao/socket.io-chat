import { Injectable } from '@nestjs/common';
import { GetAllByUserIdParams } from './dtos/get-all-by-user-id';
import { ChatPrismaRepository } from './repositories/chat-prisma.repository';

@Injectable()
export class ChatsService {
  constructor(private readonly chatPrismaRepository: ChatPrismaRepository) {}

  async getAllUserChatIds({ userId }: GetAllByUserIdParams) {
    return this.chatPrismaRepository.getAllUserChatIds({ userId });
  }
}
