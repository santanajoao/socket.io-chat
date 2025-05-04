import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { ChatsModule } from './chats/chats.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { MessagesModule } from './messages/messages.module';
import { MessageReadsModule } from './message-reads/message-reads.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SharedModule,
    ChatsModule,
    MessagesModule,
    MessageReadsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
