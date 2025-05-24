'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { chatSocket } from "../socket/backend";
import { ChatMessage } from "../types/chatMessages";
import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { backendUserApi } from "@/modules/users/apis/backend";
import debounce from "lodash.debounce";

export function useChatMessagesState() {
  const { selectedChatId, messagesAreLoading, selectedChat, setMessages, setChats, selectedChatMessages, openChatDetails } = useChatContext();

  const authContext = useAuthContext();

  const [messageContent, setMessageContent] = useState<string>('');

  const messageSubmitIsDisabled = !messageContent.trim() || messagesAreLoading;

  function handleSendMessage() {
    chatSocket.emit('message:send', {
      chatId: selectedChatId,
      content: messageContent,
    });

    setMessageContent('');
  }

  const addNewMessage = useCallback((chatId: string, message: ChatMessage) => {
    setMessages((prev) => {
      const prevMessages = prev[chatId];
      const treatedPrevMessages = prevMessages ?? []
      if (!prevMessages) return prev;

      const newMessages = [...treatedPrevMessages, message];
      return {
        ...prev,
        [chatId]: newMessages,
      }
    });
  }, []);

  const updateChatLastMessage = useCallback((chatId: string, message: ChatMessage) => {
    setChats((prev) => {
      const updatedChats = prev.map((chat) => {
        if (chat.id === chatId) {
          const targetChatIsOpen = chatId === selectedChatId;

          return {
            ...chat,
            lastMessage: message,
            unreadMessagesCount: targetChatIsOpen ? chat.unreadMessagesCount : chat.unreadMessagesCount + 1
          }
        }

        return chat;
      });

      return updatedChats;
    });
  }, [selectedChatId]);

  const handleMarkAsRead = useCallback(async (chatId: string, message: ChatMessage) => {
    const chatIsOpen = chatId === selectedChatId;
    const messageIsNotMine = message.user.id !== authContext.user?.id;
    const shouldMarkAsRead = chatIsOpen && messageIsNotMine;
    if (shouldMarkAsRead) {
      await backendUserApi.markChatMessagesAsRead(chatId);
    }
  }, [selectedChatId, authContext.user]);

  const debouncedMarkAsRead = useMemo(() => {
    return debounce(handleMarkAsRead, 700);
  }, [handleMarkAsRead]);

  useEffect(() => {
    function handleMessageReceive({ chatId, message }: { chatId: string, message: ChatMessage }) {
      updateChatLastMessage(chatId, message);
      addNewMessage(chatId, message);
      debouncedMarkAsRead(chatId, message);
    }

    chatSocket.on('message:receive', handleMessageReceive);

    return () => {
      chatSocket.off('message:receive', handleMessageReceive);

      debouncedMarkAsRead.flush();
    }
  }, [updateChatLastMessage, addNewMessage]);

  return {
    selectedChatId,
    messagesAreLoading,
    selectedChatMessages,
    messageContent,
    messageSubmitIsDisabled,
    setMessageContent,
    handleSendMessage,
    loggedUser: authContext.user,
    selectedChat,
    openChatDetails,
  };
}
