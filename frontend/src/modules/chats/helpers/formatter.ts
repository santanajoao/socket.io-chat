import { LoggedUser } from "@/modules/auth/types/login";
import { UserChat } from "@/modules/users/types/user-chats";

export class ChatFormatter {
  static formatChatName(chat: UserChat, loggedUser: LoggedUser | null) {
    if (chat.group) {
      return chat.group.title;
    }

    const targetUser = chat.users?.find((user) => user.id !== loggedUser?.id);
    return targetUser?.username ?? 'Unknown user';
  }

  static formatChatInitial(chat: UserChat, loggedUser: LoggedUser | null) {
    const chatName = ChatFormatter.formatChatName(chat, loggedUser);
    return chatName[0].toUpperCase();
  }
}
