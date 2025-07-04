import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserPrismaRepository } from './repositories/user-prisma.repository';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [forwardRef(() => ChatsModule)],
  controllers: [UsersController],
  providers: [UsersService, UserPrismaRepository],
  exports: [UserPrismaRepository],
})
export class UsersModule {}
