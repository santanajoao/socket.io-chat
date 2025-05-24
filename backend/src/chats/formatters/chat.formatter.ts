import { Injectable } from '@nestjs/common';
import { FormatChatDataParams } from '../dtos/chat-formatter';
import { FormattedChatData } from '../dtos/get-user-paginated-chat-list';
import { CHAT_TYPE } from '../models/chat.model';
import { GROUP_TYPE } from '../models/group-chat.model';

@Injectable()
export class ChatFormatter {
  formatChatData({
    messages,
    _count,
    chatUsers,
    ...chat
  }: FormatChatDataParams): FormattedChatData {
    const lastMessage = messages[0];

    const users = chatUsers.map((chatUser) => {
      return {
        id: chatUser.user.id,
        username: chatUser.user.username,
      };
    });

    const directChatUsers = chat.type === CHAT_TYPE.DIRECT ? users : undefined;
    const isPrivateChat = chat.group?.groupType === GROUP_TYPE.PRIVATE;
    const privateChatUsersCount = isPrivateChat ? _count.chatUsers : undefined;

    return {
      ...chat,
      unreadMessagesCount: _count.messages,
      lastMessage: lastMessage,
      users: directChatUsers,
      usersCount: privateChatUsersCount,
    };
  }
}
