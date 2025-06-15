'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { chatSocket } from "../socket/connection";
import { ChatMessage } from "../types/chatMessages";
import { useAuthContext } from "@/modules/auth/contexts/authContext";
import debounce from "lodash.debounce";
import { BackendChatSocketEvents } from "../socket/events";
import { CHAT_EVENTS } from "../constants/socketEvents";
import { backendChatApi } from "../apis/backend";

const MESSAGE_PAGE_SIZE = 20;

export function useChatMessagesState() {
  const { selectedChatId, messagesAreLoading, selectedChat, setMessages, setChats, selectedChatMessages, openChatDetails, handleMessagesLoading, messages } = useChatContext();

  const authContext = useAuthContext();

  const [messageContent, setMessageContent] = useState<string>('');
  const [nextMessageCursor, setNextMessageCursor] = useState<string | undefined>(undefined);

  const messageSubmitIsDisabled = !messageContent.trim() || messagesAreLoading;

  const lastMessageRef = useRef<ChatMessage | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  function handleSendMessage() {
    if (!selectedChatId) return;

    BackendChatSocketEvents.sendMessage(selectedChatId, messageContent);

    setMessageContent('');
  }

  function fetchChatMessages(chatId: string) {
    const dataEnded = !nextMessageCursor && !messagesAreLoading && selectedChatMessages.length !== 0;
    if (dataEnded || messagesAreLoading) return;

    return handleMessagesLoading(async () => {
      const response = await backendChatApi.getMessages({
        chatId,
        pageSize: MESSAGE_PAGE_SIZE,
        cursor: nextMessageCursor,
      });
      if (response.error) return;

      const messagesSorted = response.data.messages.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );

      setMessages((prev) => {
        const prevMessages = prev[chatId] ?? [];
        const newChatMessages = [...messagesSorted, ...prevMessages]
        return { ...prev, [chatId]: newChatMessages };
      });
      setNextMessageCursor(response.data.next);
    });
  }

  function scrollMessagesToBottom() {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
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
    if (!selectedChatId) return;

    const messagesNotFetched = !messages[selectedChatId];
    if (messagesNotFetched) {
      fetchChatMessages(selectedChatId);
    };
  }, [selectedChatId]);

  useEffect(() => {
    chatSocket.on(CHAT_EVENTS.MESSAGE_RECEIVE, handleMessageReceive);

    return () => {
      chatSocket.off(CHAT_EVENTS.MESSAGE_RECEIVE, handleMessageReceive);
    }
  }, [handleMessageReceive]);

  useEffect(() => {
    const lastMessage = selectedChatMessages.at(-1);
    const lastMessageIsFromLoggedUser = lastMessage?.user.id === authContext.user?.id;

    const isFirstMessagePage = selectedChatMessages.length <= MESSAGE_PAGE_SIZE;

    const lastMessageChanged = lastMessageRef.current?.id !== lastMessage?.id;
    const loggedUserSentMessage = !isFirstMessagePage && lastMessageIsFromLoggedUser && lastMessageChanged;
    if (messageListRef.current && (isFirstMessagePage || loggedUserSentMessage)) {
      scrollMessagesToBottom();
    }

    lastMessageRef.current = lastMessage ?? null;
  }, [selectedChatId, selectedChatMessages.length, authContext.user?.id]);

  function setMessageListRef(ref: HTMLDivElement | null) {
    if (ref) {
      messageListRef.current = ref;
    }
  }

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
    fetchChatMessages,
    nextMessageCursor,
    setMessageListRef,
  };
}
