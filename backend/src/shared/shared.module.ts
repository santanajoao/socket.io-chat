import { Global, Module } from '@nestjs/common';
import { PrismaDataSource } from './datasources/prisma.datasource';
import { BcryptHashService } from './hashing/bcrypt-hash.service';
import { JsonWebTokenService } from './jwt/jsonwebtoken.service';
import { JwtValidator } from './jwt/jwt.validator';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaDataSource,
    BcryptHashService,
    JsonWebTokenService,
    JwtValidator,
  ],
  controllers: [],
  exports: [
    PrismaDataSource,
    BcryptHashService,
    JsonWebTokenService,
    JwtValidator,
  ],
})
export class SharedModule {}
