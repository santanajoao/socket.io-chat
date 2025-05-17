import { ChatType } from 'generated/prisma';
import { CreateInviteRepositoryResponse } from 'src/invites/dto/create-invite';

export class CreateChatRepositoryParams {
  type: ChatType;
}

export class CreateChatRepositoryResponse {
  id: string;
}

export class CreateChatServiceParams {
  senderId: string;
  receiverEmail: string;
}

export class CreateDirectChatBody {
  receiverEmail: string;
}

export class OnDirectChatCreationBody {
  invite: CreateInviteRepositoryResponse;
  receiverUser: {
    id: string;
  };
}
