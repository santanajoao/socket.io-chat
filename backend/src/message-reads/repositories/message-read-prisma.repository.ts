import { Injectable } from '@nestjs/common';
import { PrismaDataSource } from 'src/shared/datasources/prisma.datasource';
import { MessageReadRepository } from '../interfaces/message-read-repository.interface';
import { CreateMessageReadDto } from '../dtos/create-message-read';

@Injectable()
export class MessageReadPrismaRepository implements MessageReadRepository {
  constructor(private readonly prismaDataSource: PrismaDataSource) {}

  async create(data: CreateMessageReadDto[]): Promise<void> {
    await this.prismaDataSource.messageRead.createMany({
      data,
    });
  }
}
