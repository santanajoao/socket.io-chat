export const GROUP_TYPE = {
  GLOBAL: 'GLOBAL',
  PRIVATE: 'PRIVATE',
} as const;

export type GroupTypeModel = (typeof GROUP_TYPE)[keyof typeof GROUP_TYPE];

export class GroupChatModel {
  id: string;
  title: string;
  chatId: string;
  groupType: GroupTypeModel;
  createdByUserId: string | null;
}
