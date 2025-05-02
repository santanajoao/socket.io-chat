import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtValidator } from './jwt.validator';
import { JsonWebTokenService } from './jsonwebtoken.service';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  imports: [UsersModule],
  providers: [AuthService, JwtValidator, JsonWebTokenService, JwtGuard],
  controllers: [AuthController],
  exports: [JwtValidator, JsonWebTokenService, JwtGuard],
})
export class AuthModule {}
