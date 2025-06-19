export class GetChatMessagesServiceParams {
  cursor?: string;
  pageSize: number;
  chatId: string;
}

export class GetChatMessagesRepositoryParams {
  cursor?: string;
  limit: number;
  chatId: string;
}
export class GetChatMessagesResponse {
  messages: ChatMessage[];
  total: number;
}

export class MessageUser {
  id: string;
  username: string;
}

export class ChatMessage {
  id: string;
  content: string | null;
  sentAt: Date;
  user: MessageUser | null;
}
