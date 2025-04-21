import { Global, Module } from '@nestjs/common';
import { PrismaDataSource } from './datasources/prisma.datasource';
import { BcryptHashService } from './hashing/bcrypt-hash.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaDataSource, BcryptHashService],
  controllers: [],
  exports: [PrismaDataSource, BcryptHashService],
})
export class SharedModule {}
