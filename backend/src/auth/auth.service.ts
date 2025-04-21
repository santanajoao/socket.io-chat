import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register-dto';
import { UserPrismaRepository } from 'src/users/repositories/user-prisma.repository';
import { BcryptHashService } from 'src/shared/hashing/bcrypt-hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPrismaRepository: UserPrismaRepository,
    private readonly bcryptHashService: BcryptHashService,
  ) {}

  async register(params: RegisterDto) {
    const emailExists = await this.userPrismaRepository.existsByEmail(
      params.email,
    );
    if (emailExists) {
      throw new BadRequestException('This email already exists');
    }

    const passwordHash = await this.bcryptHashService.hashPassword(
      params.password,
    );

    const user = await this.userPrismaRepository.insert({
      email: params.email,
      username: params.username,
      passwordHash,
    });

    return user;
  }
}
