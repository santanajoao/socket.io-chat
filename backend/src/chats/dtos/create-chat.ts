import { ChatModel, ChatType } from '../models/chat.model';

export class CreateChatRepositoryParams {
  type: ChatType;
}

export class CreateChatRepositoryResponse extends ChatModel {}

export class CreateChatServiceParams {
  senderId: string;
  receiverEmail: string;
}

export class CreateDirectChatBody {
  receiverEmail: string;
}
