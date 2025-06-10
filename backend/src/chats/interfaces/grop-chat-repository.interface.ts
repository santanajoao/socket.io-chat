import {
  CreateGroupChatRepositoryParams,
  CreateGroupChatRepositoryResponse,
} from '../dtos/create-group-chat';
import { UpdateChatGroupRepositoryParams } from '../dtos/update-chat';
import { GroupChatModel } from '../models/group-chat.model';

export interface GroupChatRepository {
  createGroupChat(
    params: CreateGroupChatRepositoryParams,
  ): Promise<CreateGroupChatRepositoryResponse>;
  updateGroupChat(
    chatId: string,
    data: UpdateChatGroupRepositoryParams,
  ): Promise<GroupChatModel>;
}
