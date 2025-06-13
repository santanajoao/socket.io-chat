export type ChatMessage = {
  id: string;
  content: string;
  sentAt: string;
  chatId: string;
  user: {
    id: string;
    username: string;
  },
  type: string;
}

export type GetChatMessagesParams = {
  chatId: string;
  pageSize: number;
  cursor?: string;
}

export type GetChatMessagesResponse = {
  messages: ChatMessage[];
  total: number;
  next?: string;
}
