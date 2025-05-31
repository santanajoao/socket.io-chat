export type OnInviteResponseBody = {
  id: string;
  accepted: boolean;
  senderUserId: string;
  receiverUser: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
  acceptedAt: string;
  chatId: string;
};
