import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaDataSource extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
