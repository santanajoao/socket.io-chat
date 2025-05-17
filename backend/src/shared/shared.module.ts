import { Global, Module } from '@nestjs/common';
import { PrismaDataSource } from './datasources/prisma.datasource';
import { BcryptHashService } from './hashing/bcrypt-hash.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaTransaction } from './repositories/prisma-transaction';

@Global()
@Module({
  imports: [AuthModule],
  providers: [PrismaDataSource, BcryptHashService, PrismaTransaction],
  controllers: [],
  exports: [PrismaDataSource, BcryptHashService, AuthModule, PrismaTransaction],
})
export class SharedModule {}
