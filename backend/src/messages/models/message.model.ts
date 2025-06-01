export const MESSAGE_TYPE = {
  DEFAULT: 'DEFAULT',
  NEW_CHAT: 'NEW_CHAT',
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
