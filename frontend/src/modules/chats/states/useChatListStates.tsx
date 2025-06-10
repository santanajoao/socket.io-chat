'use client';

import { useCallback, useEffect } from "react";
import { chatSocket } from "../socket/connection";
import { backendUserApi } from "@/modules/users/apis/backend";
import { backendChatApi } from "../apis/backend";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { useChatContext } from "../contexts/ChatContext";
import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { UserChat } from "@/modules/users/types/user-chats";
import { BackendChatSocketEvents } from "../socket/events";
import { CHAT_EVENTS } from "../constants/socketEvents";
import { OnChatUserRemoveBody } from "../types/removeUserFromChat";
import { OnChatGroupUpdate } from "../types/updateChatGroup";

// ao token vencer e receber erro unauthorized em qualquer request redirecionar para login
// a cada nova mensagem reordenar o chat
export function useChatListStates() {
  const {
    messages,
    setMessages,
    handleMessagesLoading,
    selectedChatId,
    setSelectedChatId,
    chats,
    setChats,
    closeChatDetails,
    unansweredInvitesCount,
    setSelectedChatUsers,
  } = useChatContext();

  const authContext = useAuthContext();

  const [chatsAreLoading, handleChatLoading] = useLoading();

  function fetchChatMessages(chatId: string) {
    return handleMessagesLoading(async () => {
      const response = await backendChatApi.getMessages({ chatId, pageSize: 20 });
      if (response.error) return;

      // ordena para renderizar de baixo para cima
      // lembrar disso quando for implementar o fetch on scroll
      const messagesSorted = response.data.messages.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );

      setMessages((prev) => ({
        ...prev,
        [chatId]: messagesSorted,
      }));
    });
  }

  async function markChatMessagesAsRead(chatId: string) {
    setChats((prev) => {
      return prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unreadMessagesCount: 0,
          };
        }

        return chat;
      });
    })

    BackendChatSocketEvents.markChatMessageAsRead(chatId);
  }

  async function selectChat(chatId: string) {
    if (selectedChatId === chatId) return;

    closeChatDetails();
    setSelectedChatId(chatId);

    const targetChat = chats.find((chat) => chat.id === chatId);
    const hasUnreadMessages = targetChat && targetChat.unreadMessagesCount > 0;

    if (hasUnreadMessages) {
      markChatMessagesAsRead(chatId);
    }

    const messagesNotFetched = !messages[chatId];
    if (messagesNotFetched) {
      fetchChatMessages(chatId);
    };
  }

  async function fetchUserChats() {
    await handleChatLoading(async () => {
      const response = await backendUserApi.getUserChats({
        pageSize: 10,
      });

      // on error render error component
      if (!response.error) {
        setChats(response.data.chats);
      }
    });
  }

  useEffect(() => {
    fetchUserChats()
  }, []);

  const onChatUserRemove = useCallback((data: OnChatUserRemoveBody) => {
    const loggedUserIsRemoved = data.userId === authContext.user?.id;
    const chatIsSelected = selectedChatId === data.chatId;

    if (!loggedUserIsRemoved && chatIsSelected) {
      setSelectedChatUsers((prev) => prev.filter((user) => user.id !== data.userId));
    }

    if (loggedUserIsRemoved && chatIsSelected) {
      setSelectedChatId(null);
      closeChatDetails();
    }

    if (loggedUserIsRemoved) {
      BackendChatSocketEvents.leaveChat(data.chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== data.chatId));
    }
  }, [authContext.user?.id, selectedChatId]);

  const onChatGroupUpdate = useCallback((data: OnChatGroupUpdate) => {
    setChats((prev) => {
      return prev.map((chat) => {
        if (chat.id !== data.chatId || !chat.group) return chat;

        return {
          ...chat,
          group: {
            ...chat.group,
            title: data.group.title,
          },
        }
      })
    });
  }, []);

  const onChatCreated = useCallback((data: UserChat) => {
    BackendChatSocketEvents.joinChat(data.id);
    setChats((prev) => [data, ...prev]);
  }, []);

  useEffect(() => {
    chatSocket.on(CHAT_EVENTS.CHAT_CREATED, onChatCreated);
    chatSocket.on(CHAT_EVENTS.CHAT_USER_REMOVE, onChatUserRemove)
    chatSocket.on(CHAT_EVENTS.CHAT_GROUP_UPDATE, onChatGroupUpdate)

    return () => {
      chatSocket.off(CHAT_EVENTS.CHAT_CREATED, onChatCreated);
      chatSocket.off(CHAT_EVENTS.CHAT_USER_REMOVE, onChatUserRemove)
      chatSocket.off(CHAT_EVENTS.CHAT_GROUP_UPDATE, onChatGroupUpdate);
    }
  }, [onChatUserRemove, onChatGroupUpdate, onChatCreated])

  return {
    chatsAreLoading,
    chats,
    selectedChatId,
    selectChat,
    loggedUser: authContext.user,
    unansweredInvitesCount,
  }
}
