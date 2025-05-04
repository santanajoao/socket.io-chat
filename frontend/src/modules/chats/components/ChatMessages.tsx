'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/modules/shared/lib/utils";
import { SendIcon } from "lucide-react";
import { Textarea } from "@/modules/shared/components/ui/textarea";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { useChatMessagesState } from "../states/useChatMessagesState";
import { FormEvent } from "react";

export function ChatMessages() {
  const {
    selectedChatId,
    messageContent,
    setMessageContent,
    messagesAreLoading,
    selectedChatMessages,
    messageSubmitIsDisabled,
    handleSendMessage,
  } = useChatMessagesState();

  function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    handleSendMessage();
  }

  function handleMessageInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessageContent(event.target.value);
  }

  return (
    <div className="max-w-2/3 p-2 border flex flex-col flex-1 gap-2">
      {selectedChatId && (
        <>
          <div className="flex-1 flex flex-col gap-2 overflow-y-scroll overflow-x-hidden">
            {messagesAreLoading ? (
              <div>Loading messages...</div>
            ) : (
              selectedChatMessages.map((message) => (
                <div
                  className={cn("flex flex-col text-sm bg-accent py-1 px-2 rounded-md min-w-3xs w-fit max-w-xs break-words whitespace-pre-wrap")}
                  key={message.id}
                >
                  <div className="font-medium">{message.user.username}</div>
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
