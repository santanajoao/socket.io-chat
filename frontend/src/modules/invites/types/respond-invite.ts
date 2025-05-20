export type RespondInviteParams = {
  inviteId: string;
  accept: boolean;
};

export type OnInviteResponseBody = {
  id: string;
  senderUserId: string;
  accepted: boolean;
  acceptedAt: string;
};
