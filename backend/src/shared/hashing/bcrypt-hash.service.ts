import { Injectable } from '@nestjs/common';
import { HashService } from './interfaces/hash-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashService implements HashService {
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async comparePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const isEqual = await bcrypt.compare(password, passwordHash);
    return isEqual;
  }
}
