import { ChatMessage } from "../types/chatMessages";

export class MessageFormatter {

  static formatMessageContent(message: ChatMessage) {
    if (message.type === 'NEW_CHAT') {
      return `${message.user.username} created the chat`;
    }

    return message.content
  }
}