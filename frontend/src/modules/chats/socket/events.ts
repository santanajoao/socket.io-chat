import { chatSocket } from "./connection";

export class BackendChatSocketEvents {
  static markChatMessageAsRead(chatId: string) {
    chatSocket.emit('chat:messages:read', { chatId });
  }
  static sendMessage(chatId: string, content: string) {
    chatSocket.emit('message:send', { chatId, content });
  }
  static joinChat(chatId: string) {
    chatSocket.emit('chat:join', { chatId });
  }
  static respondInvite(inviteId: string, accept: boolean) {
    chatSocket.emit('invite:response', { inviteId, accept });
  }
}
