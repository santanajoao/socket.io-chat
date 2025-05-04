'use client';

import { UserChat } from "@/modules/users/types/user-chats";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { Badge } from "@/modules/shared/components/ui/badge";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { useChatListStates } from "../states/useChatListStates";

export function ChatList() {
  const { chatsAreLoading, chats, selectedChatId, selectChat } = useChatListStates();

  function formatChatName(chat: UserChat) {
    return chat.group.title || chat.targetUser.username;
  }

  function formatChatInitial(chat: UserChat) {
    const chatName = formatChatName(chat);
    return chatName[0].toUpperCase();
  }

  function formatLastMessageSendAt(date: string) {
    const messageDate = new Date(date);
    const isToday = messageDate.toDateString() === new Date().toDateString();

    if (isToday) {
      return DateFormatter.formatBrazilianTime(date);
    }

    return DateFormatter.formatBrazilianDate(date);
  }

  return (
    <div className="max-w-1/3 p-2 flex-1 flex flex-col gap-1 border">
      {chatsAreLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="flex-1 flex flex-col gap-[inherit]">
          {chats.map((chat) => (
            <li key={chat.id}>
              <Button
                variant="outline"
                className={cn("w-full h-auto text-left", { "bg-accent": chat.id === selectedChatId })}
                onClick={() => selectChat(chat.id)}
                aria-label={`Open chat ${formatChatName(chat)}`}
              >
                <Badge className="rounded-full font-medium w-10 h-10 shrink-0">
                  {formatChatInitial(chat)}
                </Badge>

                <span className="flex flex-col flex-1 overflow-hidden">
                  <span>{formatChatName(chat)}</span>

                  {chat.lastMessage && (
                    <span className="text-sm line-clamp-1 flex-1">
                      {chat.type === 'GROUP' && (
                        <span className="font-medium">{chat.lastMessage.user.username}: </span>
                      )}

                      {chat.lastMessage.content}
                    </span>
                  )}
                </span>

                <span className="flex flex-col items-end text-sm gap-1">
                  {chat.lastMessage && (
                    <span>{formatLastMessageSendAt(chat.lastMessage.sentAt)}</span>
                  )}

                  <span className="font-medium rounded-full min-w-5 h-5 text-xs flex justify-center items-center bg-accent border">
                    {chat.unreadMessagesCount}
                  </span>
                </span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
