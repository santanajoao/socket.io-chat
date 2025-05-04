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

class MessageUser {
  id: string;
  username: string;
}
type MessageReads = {
  user: MessageUser;
};

export class ChatMessage {
  id: string;
  content: string;
  sentAt: Date;
  user: MessageUser;
  messageReads: MessageReads[];
}
