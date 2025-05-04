import { CreateMessageRepositoryParams } from '../dtos/create-message';
import {
  ChatMessage,
  GetChatMessagesRepositoryParams,
  GetChatMessagesResponse,
} from '../dtos/get-chat-messages';
import {
  GetUnreadMessagesByChatParams,
  UnreadMessage,
} from '../dtos/get-unread-messages-by-chat';

export interface MessageRepository {
  getMessagesByChat(
    params: GetChatMessagesRepositoryParams,
  ): Promise<GetChatMessagesResponse>;
  createMessage(params: CreateMessageRepositoryParams): Promise<ChatMessage>;
  getUnreadMessageIdsByChat(
    params: GetUnreadMessagesByChatParams,
  ): Promise<UnreadMessage[]>;
}
