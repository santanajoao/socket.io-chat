import { ChatType } from '../models/chat.model';
import { GroupType } from '../models/group-chat.model';

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
  type: ChatType;
  chatUsers: {
    user: {
      id: string;
      username: string;
    };
  }[];
  group: {
    id: string;
    title: string;
    groupType: GroupType;
    createdByUserId: string | null;
  } | null;
  messages: {
    id: string;
    content: string;
    sentAt: Date;
    user: {
      id: string;
      username: string;
    };
  }[];
  _count: {
    messages: number;
  };
}

export class FormattedChatData {
  unreadMessagesCount: number;
  lastMessage: {
    id: string;
    content: string;
    sentAt: Date;
    user: {
      id: string;
      username: string;
    };
  } | null;
  targetUser?: {
    id: string;
    username: string;
  };
  id: string;
  type: ChatType;
  group: {
    id: string;
    title: string;
    groupType: GroupType;
    createdByUserId: string | null;
  } | null;
}

export class GetUserPaginatedChatListResponse {
  chats: ChatData[];
  total: number;
}
