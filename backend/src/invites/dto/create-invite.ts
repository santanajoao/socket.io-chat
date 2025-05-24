export class CreateInviteRepositoryParams {
  chatId: string;
  senderUserId: string;
  receiverUserId: string;
}

export class CreateInviteRepositoryResponse {
  id: string;
  chat: {
    id: string;
    group: {
      id: string;
      title: string;
    } | null;
  };
  senderUser: {
    id: string;
    username: string;
  };
  receiverUser: {
    id: string;
    username: string;
  };
  createdAt: Date;
}

export class OnChatInviteBody {
  invite: CreateInviteRepositoryResponse;
  receiverUserId: string;
}
