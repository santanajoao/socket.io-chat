'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { chatSocket } from "../socket/connection";
import { ChatMessage } from "../types/chatMessages";
import { useAuthContext } from "@/modules/auth/contexts/authContext";
import debounce from "lodash.debounce";
import { BackendChatSocketEvents } from "../socket/events";

export function useChatMessagesState() {
  const { selectedChatId, messagesAreLoading, selectedChat, setMessages, setChats, selectedChatMessages, openChatDetails } = useChatContext();

  const authContext = useAuthContext();

  const [messageContent, setMessageContent] = useState<string>('');

  const messageSubmitIsDisabled = !messageContent.trim() || messagesAreLoading;

  function handleSendMessage() {
    if (!selectedChatId) return;

    BackendChatSocketEvents.sendMessage(selectedChatId, messageContent);

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

  const handleMessageReadOnReceive = useCallback(async (chatId: string, message: ChatMessage) => {
    const chatIsOpen = chatId === selectedChatId;
    const messageIsNotMine = message.user.id !== authContext.user?.id;
    const shouldMarkAsRead = chatIsOpen && messageIsNotMine;
    if (shouldMarkAsRead) {
      BackendChatSocketEvents.markChatMessageAsRead(chatId);
    }
  }, [selectedChatId, authContext.user]);

  const debouncedHandleMessageReadOnReceive = useMemo(() => {
    return debounce(handleMessageReadOnReceive, 700);
  }, [handleMessageReadOnReceive]);

  useEffect(() => {
    function handleMessageReceive({ chatId, message }: { chatId: string, message: ChatMessage }) {
      updateChatLastMessage(chatId, message);
      addNewMessage(chatId, message);
      debouncedHandleMessageReadOnReceive(chatId, message);
    }

    chatSocket.on('message:receive', handleMessageReceive);

    return () => {
      chatSocket.off('message:receive', handleMessageReceive);

      debouncedHandleMessageReadOnReceive.flush();
    }
  }, [updateChatLastMessage, addNewMessage, debouncedHandleMessageReadOnReceive]);

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
