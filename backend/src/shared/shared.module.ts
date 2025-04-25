import { Global, Module } from '@nestjs/common';
import { PrismaDataSource } from './datasources/prisma.datasource';
import { BcryptHashService } from './hashing/bcrypt-hash.service';
import { JsonWebTokenService } from './jwt/jsonwebtoken.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaDataSource, BcryptHashService, JsonWebTokenService],
  controllers: [],
  exports: [PrismaDataSource, BcryptHashService, JsonWebTokenService],
})
export class SharedModule {}
