export type TChatDetails = {
  id: string;
  type: string;
  group: {
      title: string;
      groupType: string;
      createdByUser: {
          id: string;
          username: string;
      } | null;
  } | null;
  isAdmin: boolean;
  usersCount: number;
  createdAt: Date;
}
