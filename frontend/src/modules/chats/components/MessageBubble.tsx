import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { ChatMessage } from "../types/chatMessages";
import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { cn } from "@/modules/shared/lib/utils";
import { MessageFormatter } from "../helpers/messageFormater";
import { MESSAGE_TYPE } from "../constants/messageTypes";

type Props = {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const { user: loggedUser } = useAuthContext();

  function renderMessageUsername(message: ChatMessage) {
    return loggedUser?.id === message.user?.id ? 'You' : message.user?.username;
  }

  const isFromLoggedUser = loggedUser?.id === message.user?.id;
  const isUserMessage = message.type === MESSAGE_TYPE.DEFAULT;

  return (
    <div
      className={cn(
        "flex flex-col text-sm bg-accent py-1 px-2 rounded-md min-w-3xs w-fit max-w-xs break-words whitespace-pre-wrap",
        {
          "self-end": isFromLoggedUser,
          "self-center": !isUserMessage
        },
      )}
      key={message.id}
    >
      {isUserMessage && (
        <div className="font-medium">
          {renderMessageUsername(message)}
        </div>
      )}

      <div>{MessageFormatter.formatMessageContent(message)}</div>

      <div className="text-xs text-end">
        {DateFormatter.formatBrazilianDateTime(message.sentAt)}
      </div>
    </div>
  );
}
