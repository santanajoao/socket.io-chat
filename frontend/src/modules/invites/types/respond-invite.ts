export type OnInviteResponseBody = {
  id: string;
  accepted: boolean;
  senderUserId: string;
  receiverUser: {
    id: string;
    username: string;
  };
  acceptedAt: string;
  chatId: string;
};
