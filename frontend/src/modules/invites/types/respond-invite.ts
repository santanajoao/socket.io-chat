export type RespondInviteParams = {
  inviteId: string;
  accept: boolean;
};

export type OnInviteResponseBody = {
  inviteId: string;
  senderUserId: string;
  accepted: boolean;
  acceptedAt: string;
};
