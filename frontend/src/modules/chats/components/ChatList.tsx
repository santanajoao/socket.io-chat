'use client';

import { UserChat } from "@/modules/users/types/user-chats";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { Badge } from "@/modules/shared/components/ui/badge";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { useChatListStates } from "../states/useChatListStates";
import { BellIcon, CirclePlusIcon } from "lucide-react";
import { StartNewChatModal } from "./StartNewChatModal";
import { InvitesPopover } from "./InvitesPopover";

export function ChatList() {
  const { chatsAreLoading, chats, selectedChatId, selectChat, loggedUser } = useChatListStates();

  function formatChatName(chat: UserChat) {
    return chat.group?.title || chat.targetUser?.username;
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
      <div className="flex gap-2 justify-between items-center mb-3 border px-4 py-2">
        <div className="flex items-center gap-2">
          <Badge className="rounded-full font-semibold text-sm size-10 shrink-0">
            {loggedUser?.username[0].toUpperCase()}
          </Badge>

          <span className="font-medium">{loggedUser?.username}</span>
        </div>

        <div className="flex items-center gap-[inherit]">
          <InvitesPopover asChild>
            <Button variant="outline" size="icon-sm">
              <BellIcon />
            </Button>
          </InvitesPopover>

          <StartNewChatModal trigger asChild>
            <Button variant="outline" size="icon-sm">
              <CirclePlusIcon />
            </Button>
          </StartNewChatModal>
        </div>
      </div>

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
                <Badge variant="outline" className="rounded-full font-medium size-10 shrink-0">
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
