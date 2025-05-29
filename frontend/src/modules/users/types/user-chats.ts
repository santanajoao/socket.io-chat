import { ChatUser } from "@/modules/chats/types/getChatUsers";

export type GetUserChatsParams = {
  pageSize: number;
  cursor?: string;
};

export type MessageUser = {
  id: string;
  username: string;
}

export type UserChat = {
  id: string;
  type: string;
  group?: {
    id: string;
    groupType: string;
    title: string;
    createdByUser?: ChatUser;
  }
  unreadMessagesCount: number;
  usersCount?: number;
  lastMessage: {
    id: string;
    content: string;
    sentAt: string;
    user: MessageUser;
  }
  users?: ChatUser[];
}

export type GetUserChatsResponse = {
  total: number;
  next?: string;
  chats: UserChat[];
};
