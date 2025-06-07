import { forwardRef, Module } from '@nestjs/common';
import { InvitePrismaRepository } from './repositories/invite-prisma.repository';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    forwardRef(() => ChatsModule),
    forwardRef(() => UsersModule),
    MessagesModule,
  ],
  controllers: [InvitesController],
  providers: [InvitePrismaRepository, InvitesService],
  exports: [InvitePrismaRepository, InvitesService],
})
export class InvitesModule {}
