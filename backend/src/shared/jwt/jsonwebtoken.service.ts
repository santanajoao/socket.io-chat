import { Injectable } from '@nestjs/common';
import {
  JwtPayload,
  JwtServiceInterface,
  VerifyResponse,
} from './jwt-service.interface';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class JsonWebTokenService implements JwtServiceInterface {
  sign<T extends JwtPayload>(payload: T): string {
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '4d',
      audience: '',
      issuer: '',
      subject: '',
    });

    return token;
  }

  verify<T extends JwtPayload>(token: string): VerifyResponse<T> {
    try {
      const data = jsonwebtoken.verify(token, process.env.JWT_SECRET!, {
        audience: '',
        issuer: '',
        subject: '',
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
