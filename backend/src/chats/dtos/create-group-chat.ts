import { GroupChatModel, GroupTypeModel } from '../models/group-chat.model';
import { ChatData } from './get-user-paginated-chat-list';

export class CreateGroupChatBody {
  title: string;
}

export class CreateGroupChatServiceParams {
  title: string;
  userId: string;
}

export class CreateGroupChatRepositoryParams {
  title: string;
  chatId: string;
  groupType: GroupTypeModel;
  createdByUserId: string;
}

export class CreateGroupChatRepositoryResponse extends GroupChatModel {}
export class OnCreateGroupChatBody extends ChatData {}
