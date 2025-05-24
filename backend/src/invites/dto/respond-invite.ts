import { FormattedChatData } from 'src/chats/dtos/get-user-paginated-chat-list';

export class RespondInviteRequestBody {
  accept: boolean;
  inviteId: string;
}

export class RespondInviteServiceParams extends RespondInviteRequestBody {
  userId: string;
}

export class OnInviteResponseBody {
  invite: {
    id: string;
    accepted: boolean;
    senderUserId: string;
    receiverUserId: string;
    acceptedAt: Date;
    chatId: string;
  };
  chat: FormattedChatData;
  userIdsToEmitNewChat: string[];
}
