export class RemoveUserFromChatServiceDto {
  chatId: string;
  requesterUserId: string;
  targetUserId: string;
}

export class OnRemoveUserFromChatBody {
  chatId: string;
  userId: string;
}
