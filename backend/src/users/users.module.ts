import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserPrismaRepository } from './repositories/user-prisma.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserPrismaRepository],
  exports: [UserPrismaRepository],
})
export class UsersModule {}
