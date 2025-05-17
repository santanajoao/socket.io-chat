import { PrismaRepository } from 'src/shared/repositories/prisma-repository';
import { CreateMessageReadDto } from '../dtos/create-message-read';

export interface MessageReadRepository extends PrismaRepository {
  create(data: CreateMessageReadDto[]): Promise<void>;
}
