import {
  CreateGroupChatRepositoryParams,
  CreateGroupChatRepositoryResponse,
} from '../dtos/create-group-chat';

export interface GroupChatRepository {
  createGroupChat(
    params: CreateGroupChatRepositoryParams,
  ): Promise<CreateGroupChatRepositoryResponse>;
}
