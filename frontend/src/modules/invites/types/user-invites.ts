export type UserInvite = {
  chat: {
    id: string;
    group: {
        id: string;
        title: string;
    } | null;
  };
  id: string;
  receiverUser: {
    id: string;
    username: string;
  }
  createdAt: string;
  senderUser: {
      id: string;
      username: string;
  };
  accepted: boolean;
  acceptedAt: string;
}

export type GetUserInviteResponse = UserInvite[];
