import { Injectable } from '@nestjs/common';
import { PrismaRepository } from './prisma-repository';
import { PrismaClient } from 'generated/prisma';
import { ITXClientDenyList } from 'generated/prisma/runtime/library';

@Injectable()
export class PrismaTransaction extends PrismaRepository {
  private startTransaction(client: Omit<PrismaClient, ITXClientDenyList>) {
    PrismaRepository.transactionClient = client;
  }

  private endTransaction() {
    PrismaRepository.transactionClient = null;
  }

  transaction<T>(callback: () => Promise<T>) {
    return this._prismaDataSource.$transaction(async (transaction) => {
      this.startTransaction(transaction);
      return callback().finally(() => this.endTransaction());
    });
  }
}
