import { MessageUser } from 'src/messages/dtos/get-chat-messages';
import { GroupChatModel, GroupTypeModel } from '../models/group-chat.model';
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
  groupType: GroupTypeModel;
  createdByUserId: string;
}

export class CreateGroupChatRepositoryResponse extends GroupChatModel {
  createdByUser: MessageUser | null;
}

export class OnCreateGroupChatBody extends ChatData {}
