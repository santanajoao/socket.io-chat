'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatBadge } from "./ChatBadge";
import { useChatContext } from "../contexts/ChatContext";
import { ChatFormatter } from "../helpers/chatFormatter";
import { Separator } from "@/modules/shared/components/ui/separator";
import { ChatUsers } from "./ChatUsers";
import { XIcon } from "lucide-react";
import { TChatDetails } from "../types/chatDetails";
import { useCallback, useEffect } from "react";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { backendChatApi } from "../apis/backend";
import { chatSocket } from "../socket/connection";
import { OnAdminRightUpdateBody } from "../types/updateAdminRights";
import { useAuthContext } from "@/modules/auth/contexts/authContext";

export function ChatDetails() {
  const { selectedChat, closeChatDetails, selectedChatDetails, setSelectedChatDetails, setSelectedChatUsers } = useChatContext();
  const { user: loggedUser } = useAuthContext();

  const isPrivateGroup = selectedChat?.type === "GROUP" && selectedChat.group?.groupType === "PRIVATE";
  const [chatDetailsLoading, handleLoading] = useLoading(isPrivateGroup);

  function fetchChatDetails() {
    return handleLoading(async () => {
      if (!selectedChat) return;
      const response = await backendChatApi.getChatDetails(selectedChat.id);

      if (!response.error) {
        setSelectedChatDetails(response.data);
      }
    });
  }

  function formatChatType(chat: TChatDetails) {
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

  function formatChatMembers(chat: TChatDetails) {
    if (chat.group?.groupType === "PRIVATE") {
      return `${chat.usersCount} members`;
    }

    return null;
  }

  function formatChatTypeAndMembers(chat: TChatDetails) {
    const formattedChatType = formatChatType(chat);

    if (chat.group?.groupType === "PRIVATE") {
      return `${formattedChatType} - ${formatChatMembers(chat)}`
    }

    return formattedChatType;
  }

  const onAdminRightUpdate = useCallback((data: OnAdminRightUpdateBody) => {
    if (data.userId === loggedUser?.id) {
      setSelectedChatDetails((prev) => {
        if (prev) {
          return {
            ...prev,
            isAdmin: data.isAdmin,
          };
        }

        return prev;
      })
    }

    setSelectedChatUsers((prev) => {
      return prev.map((user) => {
        if (user.id === data.userId) {
          return {
            ...user,
            isAdmin: data.isAdmin,
          };
        }

        return user;
      });
    });
  }, [loggedUser]);

  useEffect(() => {
    if (isPrivateGroup) {
      fetchChatDetails();
    }

    chatSocket.on('chat:admin-right:update', onAdminRightUpdate);
    return () => {
      chatSocket.off('chat:admin-right:update', onAdminRightUpdate);
    }
  }, [selectedChat, onAdminRightUpdate]);

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
            selectedChatDetails?.group?.groupType === 'PRIVATE' && (
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
