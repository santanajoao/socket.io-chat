export class CreateGroupInviteBody {
  chatId: string;
  email: string;
}

export class CreateGroupInviteServiceParams {
  chatId: string;
  receiverEmail: string;
  senderUserId: string;
}
