import { CreateGroupChatRepositoryParams } from '../dtos/create-group-chat';
import { GroupChat } from '../models/group-chat.model';

export interface GroupChatRepository {
  createGroupChat(params: CreateGroupChatRepositoryParams): Promise<GroupChat>;
}
