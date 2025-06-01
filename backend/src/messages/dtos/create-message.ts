import { MessageTypeModel } from '../models/message.model';

export class CreateMessageServiceParams {
  userId: string;
  chatId: string;
  content: string;
}

export type CreateMessageRepositoryParams = {
  userId: string;
  chatId: string;
  content?: string;
  type: MessageTypeModel;
};
