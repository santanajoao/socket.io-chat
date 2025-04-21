import {
  CreatedUserDto,
  CreateUserRepositoryDto,
} from '../dtos/create-user-dto';

export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>;
  insert(user: CreateUserRepositoryDto): Promise<CreatedUserDto>;
}
