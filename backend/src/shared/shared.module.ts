import { Global, Module } from '@nestjs/common';
import { PrismaDataSource } from './datasources/prisma.datasource';

@Global()
@Module({
  imports: [],
  providers: [PrismaDataSource],
  controllers: [],
  exports: [PrismaDataSource],
})
export class SharedModule {}
