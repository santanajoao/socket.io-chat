import { UserRepository } from '../interfaces/user-repository.interface';
import {
  CreateUserRepositoryDto,
  CreatedUserDto,
} from '../dtos/create-user-dto';
import { Injectable } from '@nestjs/common';
import { FindByEmailDto } from '../dtos/find-by-email-dto';
import { FindUserByIdDto } from '../dtos/find-by-id-dto';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';

@Injectable()
export class UserPrismaRepository
  extends PrismaRepository
  implements UserRepository
{
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prismaDataSource.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email,
      },
    });

    return Boolean(user);
  }

  async insert(user: CreateUserRepositoryDto): Promise<CreatedUserDto> {
    const createdUser = await this.prismaDataSource.user.create({
      select: {
        id: true,
        email: true,
        username: true,
      },
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        username: user.username,
      },
    });

    return createdUser;
  }

  async findByEmail(email: string): Promise<FindByEmailDto | null> {
    const user = await this.prismaDataSource.user.findUnique({
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
      },
      where: {
        email,
      },
    });

    return user;
  }

  async findById(id: string): Promise<FindUserByIdDto | null> {
    const user = await this.prismaDataSource.user.findUnique({
      select: {
        id: true,
        email: true,
        username: true,
      },
      where: {
        id,
      },
    });

    return user;
  }
}
