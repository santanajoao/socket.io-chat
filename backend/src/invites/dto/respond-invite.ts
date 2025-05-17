export class RespondInviteRequestBody {
  accept: boolean;
}

export class RespondInviteServiceParams extends RespondInviteRequestBody {
  userId: string;
  inviteId: string;
}

export class OnInviteResponseBody {
  inviteId: string;
  accepted: boolean;
  senderUserId: string;
  acceptedAt: Date;
}
