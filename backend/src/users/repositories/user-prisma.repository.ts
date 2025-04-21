import { PrismaDataSource } from 'src/shared/datasources/prisma.datasource';
import { UserRepository } from '../interfaces/user-repository.interface';
import {
  CreateUserRepositoryDto,
  CreatedUserDto,
} from '../dtos/create-user-dto';

export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prismaDataSource: PrismaDataSource) {}

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
}
