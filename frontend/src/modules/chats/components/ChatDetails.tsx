'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatProfileBadge } from "./ChatProfileBadge";
import { ChatFormatter } from "../helpers/chatFormatter";
import { Separator } from "@/modules/shared/components/ui/separator";
import { ChatUsers } from "./ChatUsers";
import { XIcon } from "lucide-react";
import { TChatDetails } from "../types/chatDetails";
import { CHAT_TYPE } from "../constants/chatTypes";
import { GROUP_TYPE } from "../constants/groupTypes";
import { useChatDetailsStates } from "../states/useChatDetailsStates";

// TODO: alterar nome do grupo
// TODO: apagar grupo

export function ChatDetails() {
  const {
    closeChatDetails,
    selectedChat,
    chatDetailsLoading,
    selectedChatDetails,
    isPrivateGroup,
  } = useChatDetailsStates();

  function formatChatType(chat: TChatDetails) {
    if (chat.type === CHAT_TYPE.DIRECT) {
      return 'Direct Chat'
    }

    if (chat.group?.groupType === GROUP_TYPE.GLOBAL) {
      return 'Global Group'
    }

    if (chat.group?.groupType === GROUP_TYPE.PRIVATE) {
      return 'Private Group'
    }

    return 'Chat'
  }

  function formatChatMembers(chat: TChatDetails) {
    if (chat.group?.groupType === GROUP_TYPE.PRIVATE) {
      return `${chat.usersCount} members`;
    }

    return null;
  }

  function formatChatTypeAndMembers(chat: TChatDetails) {
    const formattedChatType = formatChatType(chat);

    if (chat.group?.groupType === GROUP_TYPE.PRIVATE) {
      return `${formattedChatType} - ${formatChatMembers(chat)}`
    }

    return formattedChatType;
  }

  return (
    <div className="flex flex-1 p-2 border rounded-md flex-col">
      <ChatHeaderContainer>
        <h3>Chat Details</h3>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={closeChatDetails}
          aria-label="Close chat details"
        >
          <XIcon />
        </Button>
      </ChatHeaderContainer>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-center flex-col">
          <ChatProfileBadge variant="secondary" size="big">
            {ChatFormatter.formatChatInitial(selectedChat!, null)}
          </ChatProfileBadge>

          <span className="font-medium">
            {ChatFormatter.formatChatName(selectedChat!, null)}
          </span>

          {chatDetailsLoading ? (
            <div className="bg-accent animate-pulse rounded-md h-5 w-40" />
          ) : (
            <div>
              {formatChatTypeAndMembers(selectedChatDetails! || selectedChat!)}
            </div>
          )}

          {chatDetailsLoading ? (
            <div className="bg-accent animate-pulse rounded-md h-5 w-20" />
          ) : (
            selectedChatDetails?.group?.groupType === GROUP_TYPE.PRIVATE && (
              <span className="text-sm">
                Criado por <span className="font-medium">{selectedChatDetails.group.createdByUser?.username}</span>
              </span>
            )
          )}
        </div>

        <Separator />

        {isPrivateGroup && <ChatUsers />}
      </div>
    </div>
  );
}
