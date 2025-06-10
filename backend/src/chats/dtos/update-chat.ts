import { GroupChatModel } from '../models/group-chat.model';

export class UpdateChatGroupBody {
  title: string;
}

export class UpdateChatGroupServiceParams {
  chatId: string;
  userId: string;
  title: string;
}

export class UpdateChatGroupRepositoryParams {
  title: string;
}

export class OnChatGroupUpdateBody {
  chatId: string;
  group: GroupChatModel;
}
