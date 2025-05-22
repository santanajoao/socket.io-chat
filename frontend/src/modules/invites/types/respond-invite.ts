export type RespondInviteParams = {
  inviteId: string;
  accept: boolean;
};

export type OnInviteResponseBody = {
  id: string;
  accepted: boolean;
  senderUserId: string;
  receiverUserId: string;
  acceptedAt: string;
  chatId: string;
};
