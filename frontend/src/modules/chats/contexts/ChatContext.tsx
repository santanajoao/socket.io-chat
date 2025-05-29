'use client';

import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
import { ChatMessage } from "../types/chatMessages";
import { useLoading, UseLoadingHandle } from "@/modules/shared/hooks/useLoading";
import { UserChat } from "@/modules/users/types/user-chats";
import { chatSocket } from "../socket/connection";
import { UserInvite } from "@/modules/invites/types/user-invites";

type MessagesMap = Record<string, ChatMessage[]>
type SelectedChaId = string | null;

type ContextValues = {
  selectedChatId: SelectedChaId;
  setSelectedChatId: Dispatch<SetStateAction<SelectedChaId>>;

  messages: MessagesMap;
  setMessages: Dispatch<SetStateAction<MessagesMap>>;

  messagesAreLoading: boolean;
  handleMessagesLoading: UseLoadingHandle;

  chats: UserChat[];
  setChats: Dispatch<SetStateAction<UserChat[]>>;

  selectedChatMessages: ChatMessage[];

  invites: UserInvite[];
  setInvites: Dispatch<SetStateAction<UserInvite[]>>;

  selectedChat: UserChat | undefined;

  chatDetailsIsOpen: boolean;
  openChatDetails: () => void;
  closeChatDetails: () => void;
};

export const ChatContext = createContext<ContextValues | null>(null);

type ChatProviderProps = PropsWithChildren;

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<MessagesMap>({});
  const [messagesAreLoading, handleMessagesLoading] = useLoading();

  const [invites, setInvites] = useState<UserInvite[]>([]);

  const [chats, setChats] = useState<UserChat[]>([]);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [chatDetailsIsOpen, setChatDetailsIsOpen] = useState(false);

  const selectedChatMessages = selectedChatId ? messages[selectedChatId] ?? [] : [];

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  function closeChatDetails() {
    setChatDetailsIsOpen(false);
  }

  function openChatDetails() {
    setChatDetailsIsOpen(true);
  }

  useEffect(() => {
    chatSocket.connect();

    return () => {
      chatSocket.disconnect();
    }
  }, []);

  const values: ContextValues = {
    selectedChatId,
    messages,
    setMessages,
    handleMessagesLoading,
    setSelectedChatId,
    messagesAreLoading,
    setChats,
    chats,
    selectedChatMessages,
    invites,
    setInvites,
    selectedChat,
    chatDetailsIsOpen,
    openChatDetails,
    closeChatDetails
  };

  return (
    <ChatContext.Provider value={values}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const data = useContext(ChatContext);
  if (!data) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return data;
}
