import { CreateMessageReadDto } from '../dtos/create-message-read';

export interface MessageReadRepository {
  create(data: CreateMessageReadDto[]): Promise<void>;
}
