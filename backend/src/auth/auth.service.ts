import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register-dto';
import { UserPrismaRepository } from 'src/users/repositories/user-prisma.repository';
import { BcryptHashService } from 'src/shared/hashing/bcrypt-hash.service';
import { LoginDto } from './dtos/login-dto';
import { JsonWebTokenService } from './jsonwebtoken.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPrismaRepository: UserPrismaRepository,
    private readonly bcryptHashService: BcryptHashService,
    private readonly jsonWebTokenService: JsonWebTokenService,
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

    return {
      data: user,
    };
  }

  async login(params: LoginDto) {
    const user = await this.userPrismaRepository.findByEmail(params.email);
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const passwordIsCorrect = await this.bcryptHashService.comparePassword(
      params.password,
      user.passwordHash,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const jwtToken = this.jsonWebTokenService.sign(userWithoutPassword, {
      subject: user.id,
    });

    return {
      data: userWithoutPassword,
      metadata: {
        jwtToken,
      },
    };
  }
}
