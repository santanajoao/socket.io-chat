export const GROUP_TYPE = {
  GLOBAL: 'GLOBAL',
  PRIVATE: 'PRIVATE',
} as const;

export type GroupType = (typeof GROUP_TYPE)[keyof typeof GROUP_TYPE];

export class GroupChat {
  id: string;
  title: string;
  chatId: string;
  groupType: GroupType;
  createdByUserId: string | null;
}
