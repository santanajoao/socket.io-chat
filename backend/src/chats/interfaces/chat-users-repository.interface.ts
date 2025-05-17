import { AddUsersToChatRepositoryParams } from '../dtos/add-users-to-chat';

export interface ChatUsersRepository {
  addUsersToChat(params: AddUsersToChatRepositoryParams): Promise<unknown>;
}
