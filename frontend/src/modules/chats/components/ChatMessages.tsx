'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { SendIcon } from "lucide-react";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { useChatMessagesState } from "../states/useChatMessagesState";
import { FormEvent } from "react";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatBadge } from "./ChatBadge";
import { ChatFormatter } from "../helpers/chatFormatter";
import { MessageBubble } from "./MessageBubble";

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

  // mensagem que um novo usuário se juntou ao chat
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
                <MessageBubble key={message.id} message={message} />
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
