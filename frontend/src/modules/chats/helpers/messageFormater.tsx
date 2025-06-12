import { ReactNode } from "react";
import { ChatMessage } from "../types/chatMessages";
import { MESSAGE_TYPE } from "../constants/messageTypes";

export class MessageFormatter {

  static formatMessageContent(message: ChatMessage): string | ReactNode {
    if (message.type === MESSAGE_TYPE.NEW_CHAT) {
      return <><span className="font-medium">{message.user.username}</span> created the chat</>
    }
    if (message.type === MESSAGE_TYPE.CHAT_JOIN) {
      return <><span className="font-medium">{message.user.username}</span> joined the chat</>
    }
    if (message.type === MESSAGE_TYPE.CHAT_LEAVE) {
      return <><span className="font-medium">{message.user.username}</span> left the chat</>
    }
    if (message.type === MESSAGE_TYPE.USER_REMOVED) {
      return <><span className="font-medium">{message.user.username}</span> was removed from the chat</>
    }

    return message.content
  }
}
