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
  group: {
    id: string;
    groupType: string;
    title: string;
  } | null;
  unreadMessagesCount: number;
  lastMessage: {
    id: string;
    content: string;
    sentAt: string;
    user: MessageUser | null;
    chatId: string;
    type: string;
  }
  users?: ChatUser[];
}

export type GetUserChatsResponse = {
  total: number;
  next?: string;
  chats: UserChat[];
};
