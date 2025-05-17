import { Injectable } from '@nestjs/common';
import { MessageReadRepository } from '../interfaces/message-read-repository.interface';
import { CreateMessageReadDto } from '../dtos/create-message-read';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';

@Injectable()
export class MessageReadPrismaRepository
  extends PrismaRepository
  implements MessageReadRepository
{
  async create(data: CreateMessageReadDto[]): Promise<void> {
    await this.prismaDataSource.messageRead.createMany({
      data,
    });
  }
}
