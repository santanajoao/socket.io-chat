export class ChatInviteModel {
  id: string;
  senderUserId: string;
  receiverUserId: string;
  chatId: string;
  accepted: boolean | null;
  acceptedAt: Date | null;
  createdAt: Date;
}
