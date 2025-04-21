import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [AuthModule, UsersModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
