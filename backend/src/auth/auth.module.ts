import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtValidator } from '../shared/jwt/jwt.validator';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtValidator],
  imports: [UsersModule],
})
export class AuthModule {}
