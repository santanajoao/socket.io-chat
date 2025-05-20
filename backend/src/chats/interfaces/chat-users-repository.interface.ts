import { AddUsersToChatRepositoryParams } from '../dtos/add-users-to-chat';
import { ChatUser } from '../models/chat-user.model';

export interface ChatUsersRepository {
  addUsersToChat(params: AddUsersToChatRepositoryParams): Promise<ChatUser[]>;
  findByUserAndChat(userId: string, chatId: string): Promise<ChatUser | null>;
}
