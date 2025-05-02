import { Global, Module } from '@nestjs/common';
import { PrismaDataSource } from './datasources/prisma.datasource';
import { BcryptHashService } from './hashing/bcrypt-hash.service';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [PrismaDataSource, BcryptHashService],
  controllers: [],
  exports: [PrismaDataSource, BcryptHashService, AuthModule],
})
export class SharedModule {}
