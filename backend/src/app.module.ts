import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [AuthModule, UsersModule, SharedModule, ChatsModule],
  controllers: [],
})
export class AppModule {}
