'use client';

import { useEffect } from "react";
import { chatSocket } from "../socket/connection";
import { backendUserApi } from "@/modules/users/apis/backend";
import { backendChatApi } from "../apis/backend";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { useChatContext } from "../contexts/ChatContext";
import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { UserChat } from "@/modules/users/types/user-chats";
import { BackendChatSocketEvents } from "../socket/events";

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
  } = useChatContext();

  const authContext = useAuthContext();

  const [chatsAreLoading, handleChatLoading] = useLoading();

  function fetchChatMessages(chatId: string) {
    return handleMessagesLoading(async () => {
      const response = await backendChatApi.getMessages({ chatId, pageSize: 20 });
      if (response.error) return;

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

      if (!response.error) {
        setChats(response.data.chats);
      }
    });
  }

  async function initialize() {
    await fetchUserChats();
  }

  useEffect(() => {
    initialize();

    function onChatCreated(data: UserChat) {
      chatSocket.emit('chat:join', {
        chatId: data.id,
      });

      setChats((prev) => [data, ...prev]);
    }

    chatSocket.on('chat:created', onChatCreated);

    return () => {
      chatSocket.off('chat:created', onChatCreated);
    }
  }, [])

  return {
    chatsAreLoading,
    chats,
    selectedChatId,
    selectChat,
    loggedUser: authContext.user,
  }
}
