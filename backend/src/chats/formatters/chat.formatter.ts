import { Injectable } from '@nestjs/common';
import { FormatChatDataParams } from '../dtos/chat-formatter';
import { FormattedChatData } from '../dtos/get-user-paginated-chat-list';
import { CHAT_TYPE } from '../models/chat.model';

@Injectable()
export class ChatFormatter {
  formatChatData({
    messages,
    _count,
    chatUsers,
    userId,
    ...chat
  }: FormatChatDataParams): FormattedChatData {
    const lastMessage = messages[0];

    const targetChatUser = chatUsers.find(
      (chatUser) => chatUser.user.id !== userId,
    );

    const targetUser =
      chat.type === CHAT_TYPE.DIRECT ? targetChatUser?.user : undefined;

    return {
      ...chat,
      unreadMessagesCount: _count.messages,
      lastMessage: lastMessage,
      targetUser,
    };
  }
}
