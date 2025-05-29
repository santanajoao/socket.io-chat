import { AddUsersToChatRepositoryParams } from '../dtos/add-users-to-chat';
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
}
