import { FindByEmailDto } from 'src/users/dtos/find-by-email-dto';
import {
  CreatedUserDto,
  CreateUserRepositoryDto,
} from '../dtos/create-user-dto';
import { FindUserByIdDto } from '../dtos/find-by-id-dto';
import { PrismaRepository } from 'src/shared/repositories/prisma-repository';

export interface UserRepository extends PrismaRepository {
  existsByEmail(email: string): Promise<boolean>;
  insert(user: CreateUserRepositoryDto): Promise<CreatedUserDto>;
  findByEmail(email: string): Promise<FindByEmailDto | null>;
  findById(id: string): Promise<FindUserByIdDto | null>;
}
