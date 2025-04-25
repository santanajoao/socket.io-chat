import { FindByEmailDto } from 'src/users/dtos/find-by-email-dto';
import {
  CreatedUserDto,
  CreateUserRepositoryDto,
} from '../dtos/create-user-dto';

export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>;
  insert(user: CreateUserRepositoryDto): Promise<CreatedUserDto>;
  findByEmail(email: string): Promise<FindByEmailDto | null>;
}
