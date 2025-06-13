'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { chatSocket } from "../socket/connection";
import { ChatMessage } from "../types/chatMessages";
import { useAuthContext } from "@/modules/auth/contexts/authContext";
import debounce from "lodash.debounce";
import { BackendChatSocketEvents } from "../socket/events";
import { CHAT_EVENTS } from "../constants/socketEvents";

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

  const addNewMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const prevMessages = prev[message.chatId];
      const treatedPrevMessages = prevMessages ?? []
      if (!prevMessages) return prev;

      const newMessages = [...treatedPrevMessages, message];
      return {
        ...prev,
        [message.chatId]: newMessages,
      }
    });
  }, []);

  const updateChatLastMessage = useCallback((message: ChatMessage) => {
    setChats((prev) => {
      const updatedChats = prev.map((chat) => {
        if (chat.id === message.chatId) {
          const targetChatIsOpen = message.chatId === selectedChatId;

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

  const handleMessageReadOnReceive = useCallback(async (message: ChatMessage) => {
    const chatIsOpen = message.chatId === selectedChatId;
    const messageIsNotMine = message.user.id !== authContext.user?.id;
    const shouldMarkAsRead = chatIsOpen && messageIsNotMine;
    if (shouldMarkAsRead) {
      BackendChatSocketEvents.markChatMessageAsRead(message.chatId);
    }
  }, [selectedChatId, authContext.user?.id]);

  const debouncedHandleMessageReadOnReceive = useMemo(() => {
    return debounce(handleMessageReadOnReceive, 700);
  }, [handleMessageReadOnReceive]);

  const handleMessageReceive = useCallback((message: ChatMessage) => {
    updateChatLastMessage(message);
    addNewMessage(message);
    debouncedHandleMessageReadOnReceive(message);

    return () => {
      debouncedHandleMessageReadOnReceive.flush();
    }
  }, [addNewMessage, debouncedHandleMessageReadOnReceive, updateChatLastMessage]);

  useEffect(() => {
    chatSocket.on(CHAT_EVENTS.MESSAGE_RECEIVE, handleMessageReceive);

    return () => {
      chatSocket.off(CHAT_EVENTS.MESSAGE_RECEIVE, handleMessageReceive);
    }
  }, [handleMessageReceive]);

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
