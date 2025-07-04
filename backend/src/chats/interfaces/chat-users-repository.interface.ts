import { AddUsersToChatRepositoryParams } from '../dtos/add-users-to-chat';
import { CountChatUsersRepositoryResponse } from '../dtos/count-chat-users';
import { ChatUserModel } from '../models/chat-user.model';

export interface ChatUsersRepository {
  addUsersToChat(
    params: AddUsersToChatRepositoryParams,
  ): Promise<ChatUserModel[]>;
  findByUserAndChat(
    userId: string,
    chatId: string,
  ): Promise<ChatUserModel | null>;
  findByChatAndUsers(
    chatId: string,
    userIds: string[],
  ): Promise<ChatUserModel[]>;
  deleteChatUser(chatId: string, userId: string): Promise<void>;
  countChatUsers(chatId: string): Promise<CountChatUsersRepositoryResponse>;
}
