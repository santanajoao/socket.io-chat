'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { useChatListStates } from "../states/useChatListStates";
import { BellIcon, CirclePlusIcon } from "lucide-react";
import { StartNewChatModal } from "./StartNewChatModal";
import { InvitesPopover } from "./InvitesPopover";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatBadge } from "./ChatBadge";
import { ChatFormatter } from "../helpers/chatFormatter";
import { MessageFormatter } from "../helpers/messageFormater";

export function ChatList() {
  const { chatsAreLoading, chats, selectedChatId, selectChat, loggedUser } = useChatListStates();

  function formatLastMessageSendAt(date: string) {
    const messageDate = new Date(date);
    const isToday = messageDate.toDateString() === new Date().toDateString();

    if (isToday) {
      return DateFormatter.formatBrazilianTime(date);
    }

    return DateFormatter.formatBrazilianDate(date);
  }

  return (
    <div className="p-2 flex-1 flex flex-col gap-1 border rounded-md">
      <ChatHeaderContainer>
        <div className="flex items-center gap-2">
          <ChatBadge>
            {loggedUser?.username[0].toUpperCase()}
          </ChatBadge>

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
      </ChatHeaderContainer>

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
                aria-label={`Open chat ${ChatFormatter.formatChatName(chat, loggedUser)}`}
              >
                <ChatBadge variant="outline">
                  {ChatFormatter.formatChatInitial(chat, loggedUser)}
                </ChatBadge>

                <span className="flex flex-col flex-1 overflow-hidden">
                  <span>{ChatFormatter.formatChatName(chat, loggedUser)}</span>

                  {chat.lastMessage && (
                    <span className="text-sm line-clamp-1 flex-1">
                      {chat.type === 'GROUP' && (
                        <span className="font-medium">{chat.lastMessage.user.username}: </span>
                      )}

                      {MessageFormatter.formatMessageContent(chat.lastMessage)}
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
