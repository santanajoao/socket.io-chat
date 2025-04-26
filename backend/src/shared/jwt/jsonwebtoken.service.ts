import { Injectable } from '@nestjs/common';
import {
  JwtConfig,
  JwtPayload,
  JwtServiceInterface,
  VerifyResponse,
} from './jwt-service.interface';
import * as jsonwebtoken from 'jsonwebtoken';
import { JWT_DEFAULT_CONFIG } from 'src/auth/constants/jwt';

@Injectable()
export class JsonWebTokenService implements JwtServiceInterface {
  sign<T extends JwtPayload>(payload: T, config?: JwtConfig): string {
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET!, {
      ...JWT_DEFAULT_CONFIG,
      subject: config?.subject,
    });

    return token;
  }

  verify<T extends JwtPayload>(
    token: string,
    config?: JwtConfig,
  ): VerifyResponse<T> {
    try {
      const data = jsonwebtoken.verify(token, process.env.JWT_SECRET!, {
        ...JWT_DEFAULT_CONFIG,
        subject: config?.subject,
      });

      return {
        valid: true,
        data: data as T,
      };
    } catch {
      return {
        valid: false,
        data: null,
      };
    }
  }
}
