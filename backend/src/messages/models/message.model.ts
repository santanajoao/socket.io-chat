export const MESSAGE_TYPE = {
  DEFAULT: 'DEFAULT',
  NEW_CHAT: 'NEW_CHAT',
  CHAT_JOIN: 'CHAT_JOIN',
  CHAT_LEAVE: 'CHAT_LEAVE',
  USER_REMOVED: 'USER_REMOVED',
} as const;

export type MessageTypeModel = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export class MessageModel {
  id: string;
  content: string;
  type: MessageTypeModel;
  chatId: string;
  userId: string;
  sentAt: Date;
}
