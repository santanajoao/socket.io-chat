import { MessageUser } from 'src/messages/dtos/get-chat-messages';
import { ChatTypeModel } from '../models/chat.model';
import { GroupTypeModel } from '../models/group-chat.model';
import { MessageType } from 'generated/prisma';

export class GetUserPaginatedChatListRepositoryParams {
  userId: string;
  cursor?: string;
  limit: number;
}

export class GetUserPaginatedChatListServiceParams {
  userId: string;
  cursor?: string;
  pageSize: number;
}

export class ChatData {
  id: string;
  type: ChatTypeModel;
  chatUsers: {
    user: MessageUser;
  }[];
  group: {
    id: string;
    title: string;
    groupType: GroupTypeModel;
  } | null;
  messages: {
    id: string;
    content: string | null;
    sentAt: Date;
    user: MessageUser | null;
    type: MessageType;
  }[];
  _count: {
    messages: number;
  };
}

export class FormattedChatData {
  unreadMessagesCount: number;
  lastMessage: {
    id: string;
    content: string | null;
    sentAt: Date;
    user: MessageUser | null;
    type: MessageType;
  } | null;
  users?: MessageUser[];
  id: string;
  type: ChatTypeModel;
  group: {
    id: string;
    title: string;
    groupType: GroupTypeModel;
  } | null;
}

export class GetUserPaginatedChatListResponse {
  chats: ChatData[];
  total: number;
}
