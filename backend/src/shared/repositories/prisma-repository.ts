import { Injectable } from '@nestjs/common';
import { PrismaDataSource } from '../datasources/prisma.datasource';
import { ITXClientDenyList } from 'generated/prisma/runtime/library';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export abstract class PrismaRepository {
  protected static transactionClient: Omit<
    PrismaClient,
    ITXClientDenyList
  > | null = null;

  constructor(protected readonly _prismaDataSource: PrismaDataSource) {}

  protected get prismaDataSource() {
    if (!PrismaRepository.transactionClient) {
      console.log('not in transaction');
      return this._prismaDataSource;
    }
    console.log('in transaction');
    return PrismaRepository.transactionClient;
  }
}
