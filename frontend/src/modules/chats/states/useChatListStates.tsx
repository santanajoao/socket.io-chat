'use client';

import { useEffect } from "react";
import { chatSocket } from "../socket/backend";
import { backendUserApi } from "@/modules/users/apis/backend";
import { backendChatApi } from "../apis/backend";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { useChatContext } from "../contexts/ChatContext";

export function useChatListStates() {
  const {
    messages,
    setMessages,
    handleMessagesLoading,
    selectedChatId,
    setSelectedChatId,
    chats,
    setChats,
    selectedChatMessages,
  } = useChatContext();

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

    await backendUserApi.markChatMessagesAsRead(chatId);
  }

  async function selectChat(chatId: string) {
    setSelectedChatId(chatId);

    const selectedChat = chats.find((chat) => chat.id === chatId);
    const hasUnreadMessages = selectedChat && selectedChat.unreadMessagesCount > 0;

    if (hasUnreadMessages) {
      markChatMessagesAsRead(chatId);
    }

    const messagesNotFetched = !messages[chatId];
    if (messagesNotFetched)  {
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

    chatSocket.connect();
  }

  useEffect(() => {
    initialize();

    return () => {
      chatSocket.disconnect();
    }
  }, []);

  return {
    chatsAreLoading,
    chats,
    selectedChatId,
    selectChat
  }
}
