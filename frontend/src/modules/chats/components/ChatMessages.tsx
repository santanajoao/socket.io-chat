'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { SendIcon } from "lucide-react";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { useChatMessagesState } from "../states/useChatMessagesState";
import { FormEvent, UIEvent } from "react";
import { ChatHeaderContainer } from "./ChatHeaderContainer";
import { ChatProfileBadge } from "./ChatProfileBadge";
import { ChatFormatter } from "../helpers/chatFormatter";
import { MessageBubble } from "./MessageBubble";
import { MessageLoadingSkelleton } from "./MessageLoadingSkelleton";

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
    openChatDetails,
    setMessageListRef,
    fetchChatMessages,
  } = useChatMessagesState();

  function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    handleSendMessage();
  }

  function handleMessageInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessageContent(event.target.value);
  }

  function onMessageScroll(event: UIEvent<HTMLDivElement>) {
    if (!(event.target instanceof HTMLDivElement)) return;

    const hasScroll = event.target.scrollHeight > event.target.clientHeight;
    if (!selectedChatId || !hasScroll) return;

    const threshold = event.target.scrollHeight * 0.15;
    const reachedScrollTop = event.target.scrollTop <= threshold;
    if (reachedScrollTop) {
      fetchChatMessages(selectedChatId);
    }
  }

  return (
    <section className={cn("p-2 border flex flex-col flex-1 gap-2 rounded-md overflow-hidden", className)}>
      {selectedChatId && (
        <>
          <ChatHeaderContainer>
            <Button
              variant="link"
              className="gap-[inherit]"
              size="blank"
              onClick={openChatDetails}
              aria-label="Open chat details"
              aria-controls="chat-details"
            >
              <ChatProfileBadge>
                {ChatFormatter.formatChatInitial(selectedChat!, loggedUser)}
              </ChatProfileBadge>

              <span className="font-medium">{ChatFormatter.formatChatName(selectedChat!, loggedUser)}</span>
            </Button>
          </ChatHeaderContainer>

          <div
            ref={(el) => setMessageListRef(el)}
            className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden pr-2"
            onScroll={onMessageScroll}
          >
            {messagesAreLoading && (
              <MessageLoadingSkelleton />
            )}

            {selectedChatMessages.length !== 0 && (
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
              aria-label="Message input"
            />

            <Button aria-label="Send message" type="submit" disabled={messageSubmitIsDisabled}>
              <SendIcon />
            </Button>
          </form>
        </>
      )}
    </section>
  );
}
