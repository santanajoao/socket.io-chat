import { ChatType, GroupType } from 'generated/prisma';

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

class ChatData {
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

export class GetUserPaginatedChatListResponse {
  chats: ChatData[];
  total: number;
}
