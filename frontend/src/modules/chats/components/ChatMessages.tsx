'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { SendIcon } from "lucide-react";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { useChatMessagesState } from "../states/useChatMessagesState";
import { FormEvent } from "react";
import { ChatMessage } from "../types/chatMessages";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatBadge } from "./ChatBadge";
import { ChatFormatter } from "../helpers/formatter";

// trocar http por websocket na leitura de mensagens

type Props = {
  className?: string;
}

export function ChatMessages({ className }: Props) {
  const {
    selectedChatId,
    messageContent,
    setMessageContent,
    messagesAreLoading,
    selectedChatMessages,
    messageSubmitIsDisabled,
    handleSendMessage,
    loggedUser,
    selectedChat,
    openChatDetails
  } = useChatMessagesState();

  function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    handleSendMessage();
  }

  function handleMessageInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessageContent(event.target.value);
  }

  function renderMessageUsername(message: ChatMessage) {
    return loggedUser?.id === message.user.id ? 'You' : message.user.username;
  }

  return (
    <div className={cn("p-2 border flex flex-col flex-1 gap-2 rounded-md overflow-hidden", className)}>
      {selectedChatId && (
        <>
          <ChatHeaderContainer>
            <Button variant="link" asChild className="p-0" onClick={openChatDetails}>
              <div className="flex items-center gap-[inherit]">
                <ChatBadge>
                  {ChatFormatter.formatChatInitial(selectedChat!, loggedUser)}
                </ChatBadge>

                <span className="font-medium">{ChatFormatter.formatChatName(selectedChat!, loggedUser)}</span>
              </div>
            </Button>
          </ChatHeaderContainer>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden pr-2">
            {messagesAreLoading ? (
              <div>Loading messages...</div>
            ) : (
              selectedChatMessages.map((message) => (
                <div
                  className={cn(
                    "flex flex-col text-sm bg-accent py-1 px-2 rounded-md min-w-3xs w-fit max-w-xs break-words whitespace-pre-wrap",
                    { "self-end": loggedUser?.id === message.user.id },
                  )}
                  key={message.id}
                >
                  <div className="font-medium">
                    {renderMessageUsername(message)}
                  </div>
                  <div>{message.content}</div>
                  <div className="text-xs  text-end">
                    {DateFormatter.formatBrazilianDateTime(message.sentAt)}
                  </div>
                </div>
              ))
            )}
          </div>

          <form className="flex gap-2 items-end" onSubmit={handleMessageSubmit}>
            <Textarea
              value={messageContent}
              name="message"
              disabled={messagesAreLoading}
              onChange={handleMessageInputChange}
              className="resize-none"
            />

            <Button type="submit" disabled={messageSubmitIsDisabled}>
              <SendIcon />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
