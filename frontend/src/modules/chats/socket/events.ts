import { CHAT_EVENTS } from "../constants/socketEvents";
import { chatSocket } from "./connection";

export class BackendChatSocketEvents {
  static markChatMessageAsRead(chatId: string) {
    chatSocket.emit(CHAT_EVENTS.READ_CHAT_MESSAGES, { chatId });
  }
  static sendMessage(chatId: string, content: string) {
    chatSocket.emit(CHAT_EVENTS.SEND_MESSAGE, { chatId, content });
  }
  static joinChat(chatId: string) {
    chatSocket.emit(CHAT_EVENTS.JOIN_CHAT, { chatId });
  }
  static leaveChat(chatId: string) {
    chatSocket.emit(CHAT_EVENTS.LEAVE_CHAT, { chatId });
  }
  static respondInvite(inviteId: string, accept: boolean) {
    chatSocket.emit(CHAT_EVENTS.INVITE_RESPONSE, { inviteId, accept });
  }
}
