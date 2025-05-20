import { GroupType } from '../models/group-chat.model';
import { ChatData } from './get-user-paginated-chat-list';

export class CreateGroupChatBody {
  name: string;
}

export class CreateGroupChatServiceParams {
  name: string;
  userId: string;
}

export class CreateGroupChatRepositoryParams {
  title: string;
  chatId: string;
  groupType: GroupType;
  createdByUserId: string;
}

export class OnCreateGroupChatBody extends ChatData {}
