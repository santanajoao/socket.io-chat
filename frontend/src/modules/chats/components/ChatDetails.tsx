'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatProfileBadge } from "./ChatProfileBadge";
import { ChatFormatter } from "../helpers/chatFormatter";
import { Separator } from "@/modules/shared/components/ui/separator";
import { ChatUsers } from "./ChatUsers";
import { LogOutIcon, PencilIcon, PencilOffIcon, SaveIcon, XIcon } from "lucide-react";
import { TChatDetails } from "../types/chatDetails";
import { CHAT_TYPE } from "../constants/chatTypes";
import { GROUP_TYPE } from "../constants/groupTypes";
import { useChatDetailsStates } from "../states/useChatDetailsStates";
import { Input } from "@/modules/shared/components/ui/input";
import { ConfirmationModalTrigger } from "./ConfirmationModalTrigger";

export function ChatDetails() {
  const {
    closeChatDetails,
    selectedChat,
    chatDetailsLoading,
    selectedChatDetails,
    isPrivateGroup,
    isEditingGroupName,
    startGroupNameEdition,
    editedGroupName,
    cancelGroupNameEdition,
    saveGroupName,
    setEditedGroupName,
    groupNameEditionIsLoading,
    editedGroupNameIsTheSame,
    leaveGroupChat,
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

  function onGroupNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditedGroupName(event.target.value);
  }

  return (
    <div className="flex flex-1 p-2 border rounded-md flex-col overflow-hidden">
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

      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        <div className="flex items-center gap-2 justify-center flex-col">
          <ChatProfileBadge variant="secondary" size="big">
            {ChatFormatter.formatChatInitial(selectedChat!, null)}
          </ChatProfileBadge>

          <div className="flex items-center gap-1">
            {isEditingGroupName ? (
              <Input onChange={onGroupNameChange} defaultValue={editedGroupName} className="h-7" />
            ) : (
              <span className="font-medium">
                {ChatFormatter.formatChatName(selectedChat!, null)}
              </span>
            )}

            {isPrivateGroup && selectedChatDetails?.isAdmin && (
              isEditingGroupName ? (
                <>
                  <Button
                    aria-label="Cancel group name edition"
                    variant="ghost"
                    size="icon-sm"
                    onClick={cancelGroupNameEdition}
                    disabled={groupNameEditionIsLoading}
                  >
                    <PencilOffIcon />
                  </Button>

                  <Button
                    aria-label="Save group name"
                    variant="ghost"
                    size="icon-sm"
                    disabled={!editedGroupName || editedGroupNameIsTheSame || groupNameEditionIsLoading}
                    onClick={saveGroupName}
                  >
                    <SaveIcon />
                  </Button>
                </>
              ) : (
                <Button
                  aria-label="Edit group name"
                  variant="ghost"
                  size="icon-sm"
                  onClick={startGroupNameEdition}
                >
                  <PencilIcon />
                </Button>
              )
            )}
          </div>

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
            isPrivateGroup && (
              <span className="text-sm">
                Criado por <span className="font-medium">{selectedChatDetails?.group?.createdByUser?.username}</span>
              </span>
            )
          )}
        </div>

        <Separator />

        {isPrivateGroup && <ChatUsers />}

        {isPrivateGroup && (
          <ConfirmationModalTrigger
            asChild
            variant="destructive"
            onConfirm={leaveGroupChat}
          >
            <Button disabled={chatDetailsLoading} size="lg" variant="outline">
              <LogOutIcon />

              Leave Group
            </Button>
          </ConfirmationModalTrigger>
        )}
      </div>
    </div>
  );
}
