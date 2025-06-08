'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { useChatListStates } from "../states/useChatListStates";
import { BellIcon, CirclePlusIcon } from "lucide-react";
import { StartNewChatModal } from "./StartNewChatModal";
import { InvitesPopover } from "./InvitesPopover";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatProfileBadge } from "./ChatProfileBadge";
import { ChatFormatter } from "../helpers/chatFormatter";
import { MessageFormatter } from "../helpers/messageFormater";
import { CHAT_TYPE } from "../constants/chatTypes";
import { CountBadge } from "./CountBadge";
import { LoaderContainer } from "@/modules/shared/components/containers/LoaderContainer";
import { MESSAGE_TYPE } from "../constants/messageTypes";
import { UserMenu } from "./UserMenu";

export function ChatList() {
  const {
    chatsAreLoading,
    chats,
    selectedChatId,
    selectChat,
    loggedUser,
    unansweredInvitesCount,
  } = useChatListStates();

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
        <UserMenu />

        <div className="flex items-center gap-[inherit]">
          <InvitesPopover asChild>
            <Button
              aria-label={`Open invite list. There are ${unansweredInvitesCount} unanswered invites`}
              variant="outline"
              size="icon-sm"
              className="relative"
            >
              <BellIcon />
              <CountBadge className="absolute -top-2 -left-2">
                {unansweredInvitesCount}
              </CountBadge>
            </Button>
          </InvitesPopover>

          <StartNewChatModal trigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="Start a new chat">
              <CirclePlusIcon />
            </Button>
          </StartNewChatModal>
        </div>
      </ChatHeaderContainer>

      <div className="flex-1 flex flex-col gap-[inherit]">
        {chatsAreLoading ? (
          <div className="flex-1 flex flex-col gap-[inherit]">
            {Array.from({ length: 5 }).map((_, index) => (
              <LoaderContainer key={index} className="h-16" />
            ))}
          </div>
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
                  <ChatProfileBadge variant="outline">
                    {ChatFormatter.formatChatInitial(chat, loggedUser)}
                  </ChatProfileBadge>
                  <span className="flex flex-col flex-1 overflow-hidden">
                    <span>{ChatFormatter.formatChatName(chat, loggedUser)}</span>
                    {chat.lastMessage && (
                      <span className="text-sm line-clamp-1 flex-1">
                        {(chat.type === CHAT_TYPE.GROUP && chat.lastMessage.type === MESSAGE_TYPE.DEFAULT) && (
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
                    <CountBadge>
                      {chat.unreadMessagesCount}
                    </CountBadge>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
