'use client';

import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { useChatContext } from "../contexts/ChatContext";
import { GROUP_TYPE } from "../constants/groupTypes";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { CHAT_TYPE } from "../constants/chatTypes";
import { useCallback, useEffect } from "react";
import { backendChatApi } from "../apis/backend";
import { OnAdminRightUpdateBody } from "../types/updateAdminRights";
import { chatSocket } from "../socket/connection";
import { CHAT_EVENTS } from "../constants/socketEvents";

export function useChatDetailsStates() {
  const { selectedChat, closeChatDetails, selectedChatDetails, setSelectedChatDetails, setSelectedChatUsers } = useChatContext();
  const { user: loggedUser } = useAuthContext();

  const isPrivateGroup = selectedChat?.type === CHAT_TYPE.GROUP && selectedChat.group?.groupType === GROUP_TYPE.PRIVATE;
  const [chatDetailsLoading, handleLoading] = useLoading(isPrivateGroup);

  const fetchChatDetails = useCallback(() => {
    return handleLoading(async () => {
      if (!selectedChat?.id) return;
      const response = await backendChatApi.getChatDetails(selectedChat.id);

      if (!response.error) {
        setSelectedChatDetails(response.data);
      }
    });
  }, [selectedChat?.id]);

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
  }, [loggedUser?.id]);

  useEffect(() => {
    if (isPrivateGroup) {
      fetchChatDetails();
    }
  }, [selectedChat?.id, isPrivateGroup, fetchChatDetails]);

  useEffect(() => {
    chatSocket.on(CHAT_EVENTS.CHAT_ADMIN_RIGHT_UPDATE, onAdminRightUpdate);
    return () => {
      chatSocket.off(CHAT_EVENTS.CHAT_ADMIN_RIGHT_UPDATE, onAdminRightUpdate);
    }
  }, [onAdminRightUpdate]);

  return {
    closeChatDetails,
    selectedChat,
    chatDetailsLoading,
    selectedChatDetails,
    isPrivateGroup,
  };
}
