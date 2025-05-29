'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatBadge } from "./ChatBadge";
import { useChatContext } from "../contexts/ChatContext";
import { ChatFormatter } from "../helpers/formatter";
import { UserChat } from "@/modules/users/types/user-chats";
import { Separator } from "@/modules/shared/components/ui/separator";
import { ChatUsers } from "./ChatUsers";
import { XIcon } from "lucide-react";

export function ChatDetails() {
  const { selectedChat, closeChatDetails } = useChatContext();

  function formatChatType(chat: UserChat) {
    if (chat.type === "DIRECT") {
      return 'Direct Chat'
    }

    if (chat.group?.groupType === "GLOBAL") {
      return 'Global Group'
    }

    if (chat.group?.groupType === "PRIVATE") {
      return 'Private Group'
    }

    return 'Chat'
  }

  function formatChatMembers(chat: UserChat) {
    if (chat.group?.groupType === "PRIVATE") {
      return `${chat.usersCount} members`;
    }

    return null;
  }

  function formatChatTypeAndMembers(chat: UserChat) {
    const formattedChatType = formatChatType(chat);

    if (chat.group?.groupType === "PRIVATE") {
      return `${formattedChatType} - ${formatChatMembers(chat)}`
    }

    return formattedChatType;
  }

  const isPrivateGroup = selectedChat?.type === "GROUP" && selectedChat.group?.groupType === "PRIVATE";

  return (
    <div className="flex flex-1 p-2 border rounded-md flex-col">
      <ChatHeaderContainer>
        <h3>Chat Details</h3>

        <Button variant="ghost" size="icon-sm" onClick={closeChatDetails}>
          <XIcon />
        </Button>
      </ChatHeaderContainer>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-center flex-col">
          <ChatBadge variant="secondary" size="big">
            {ChatFormatter.formatChatInitial(selectedChat!, null)}
          </ChatBadge>

          {/* TODO: funcionalidade de editar nome do chat */}
          <span className="font-medium">
            {ChatFormatter.formatChatName(selectedChat!, null)}
          </span>

          <div>
            {formatChatTypeAndMembers(selectedChat!)}
          </div>

          {selectedChat?.group?.groupType === 'PRIVATE' && (
            <span className="text-sm">
              Criado por <span className="font-medium">{selectedChat?.group?.createdByUser?.username}</span>
            </span>
          )}
        </div>

        <Separator />

        {isPrivateGroup && <ChatUsers />}
      </div>
    </div>
  );
}
