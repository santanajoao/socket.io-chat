'use client';

import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { useChatContext } from "../contexts/ChatContext";
import { GROUP_TYPE } from "../constants/groupTypes";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { CHAT_TYPE } from "../constants/chatTypes";
import { useCallback, useEffect, useState } from "react";
import { backendChatApi } from "../apis/backend";
import { OnAdminRightUpdateBody } from "../types/updateAdminRights";
import { chatSocket } from "../socket/connection";
import { CHAT_EVENTS } from "../constants/socketEvents";
import { toast } from "sonner";

type ChatLike = {
  id: string;
  group: {
    title: string;
  } | null;
}

export function useChatDetailsStates() {
  const { selectedChatId, selectedChat, closeChatDetails, selectedChatDetails, setSelectedChatDetails, setSelectedChatUsers, setChats } = useChatContext();
  const { user: loggedUser } = useAuthContext();

  const [isEditingGroupName, setIsEditingGroupName] = useState<boolean>(false);
  const [groupNameEditionIsLoading, handleGroupNameEditionLoading] = useLoading(isEditingGroupName);

  const [editedGroupName, setEditedGroupName] = useState<string>('');

  const isPrivateGroup = selectedChat?.type === CHAT_TYPE.GROUP && selectedChat.group?.groupType === GROUP_TYPE.PRIVATE;
  const [chatDetailsLoading, handleLoading] = useLoading(isPrivateGroup);

  const fetchChatDetails = useCallback(() => {
    return handleLoading(async () => {
      if (!selectedChatId) return;
      const response = await backendChatApi.getChatDetails(selectedChatId);

      // render error component on error
      if (!response.error) {
        setSelectedChatDetails(response.data);
      }
    });
  }, [selectedChatId]);

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
  }, [isPrivateGroup, fetchChatDetails]);

  useEffect(() => {
    chatSocket.on(CHAT_EVENTS.CHAT_ADMIN_RIGHT_UPDATE, onAdminRightUpdate);
    return () => {
      chatSocket.off(CHAT_EVENTS.CHAT_ADMIN_RIGHT_UPDATE, onAdminRightUpdate);
    }
  }, [onAdminRightUpdate]);

  function startGroupNameEdition() {
    setIsEditingGroupName(true);
  }

  function cancelGroupNameEdition() {
    setIsEditingGroupName(false);
    setEditedGroupName('');
  }

  function updateGroupName<T extends ChatLike | null>(chat: T): T {
    if (!chat || !chat.group) return chat;

    return {
      ...chat,
      group: {
        ...chat.group,
        title: editedGroupName,
      },
    }
  }

  const currentEditedGroupName = editedGroupName || selectedChat?.group?.title;
  const treatedGroupName = currentEditedGroupName?.trim();
  const editedGroupNameIsTheSame = selectedChat?.group?.title === treatedGroupName;

  const editedGroupNameIsInvalid = !selectedChatId || !treatedGroupName || editedGroupNameIsTheSame;

  function saveGroupName() {
    handleGroupNameEditionLoading(async () => {
      if (editedGroupNameIsInvalid) return;

      const result = await backendChatApi.updateChatGroup(selectedChatId, {
        title: treatedGroupName,
      });

      if (result.error) {
        return toast.error(result.error.message, { richColors: true });
      }

      setChats((prev) => {
        return prev.map((chat) => {
          if (chat.id === selectedChatId) {
            return updateGroupName(chat);
          }
          return chat;
        });
      })

      cancelGroupNameEdition();
    })
  }


  return {
    closeChatDetails,
    selectedChat,
    chatDetailsLoading,
    selectedChatDetails,
    isPrivateGroup,
    isEditingGroupName,
    setIsEditingGroupName,
    startGroupNameEdition,
    editedGroupName: currentEditedGroupName,
    setEditedGroupName,
    cancelGroupNameEdition,
    saveGroupName,
    groupNameEditionIsLoading,
    editedGroupNameIsTheSame,
  };
}
