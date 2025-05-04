export type GetUserChatsParams = {
  pageSize: number;
  cursor?: string;
};

export type UserChat = {
  id: string;
  type: string;
  group: {
    id: string;
    groupType: string;
    title: string;
  }
  unreadMessagesCount: number;
  lastMessage: {
    id: string;
    content: string;
    sentAt: string;
    user: {
      id: string;
      username: string;
    }
  }
  targetUser: {
    id: string;
    username: string;
  }
}

export type GetUserChatsResponse = {
  total: number;
  next?: string;
  chats: UserChat[];
};
