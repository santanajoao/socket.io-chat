'use client';

import { useCallback, useEffect, useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { chatSocket } from "../socket/backend";
import { ChatMessage } from "../types/chatMessages";

export function useChatMessagesState() {
  const { selectedChatId, messagesAreLoading, setMessages, setChats, selectedChatMessages } = useChatContext();

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
      const prevMessages = prev[chatId] ?? [];
      if (prevMessages.length === 0) return prev;

      const newMessages = [...prevMessages, message];
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

  useEffect(() => {
    function handleMessageReceive({ chatId, message }: { chatId: string, message: ChatMessage }) {
      updateChatLastMessage(chatId, message);
      addNewMessage(chatId, message);
    }

    chatSocket.on('message:receive', handleMessageReceive);

    return () => {
      chatSocket.off('message:receive', handleMessageReceive);
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
  };
}