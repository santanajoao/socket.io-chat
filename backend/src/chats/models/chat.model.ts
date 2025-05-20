export const CHAT_TYPE = {
  DIRECT: 'DIRECT',
  GROUP: 'GROUP',
} as const;

export type ChatType = (typeof CHAT_TYPE)[keyof typeof CHAT_TYPE];

export class ChatModel {
  id: string;
  type: ChatType;
  createdAt: Date;
}
