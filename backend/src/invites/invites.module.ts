import { forwardRef, Module } from '@nestjs/common';
import { InvitePrismaRepository } from './repositories/invite-prisma.repository';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [forwardRef(() => ChatsModule)],
  controllers: [InvitesController],
  providers: [InvitePrismaRepository, InvitesService],
  exports: [InvitePrismaRepository],
})
export class InvitesModule {}
