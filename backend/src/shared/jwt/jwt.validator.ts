import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenService } from 'src/shared/jwt/jsonwebtoken.service';
import { JwtPayloadDto } from './jwt.interfaces';

@Injectable()
export class JwtValidator {
  constructor(private jsonWebTokenService: JsonWebTokenService) {}

  validate(jwtToken: string | undefined) {
    if (!jwtToken) {
      throw new UnauthorizedException('Missing access token');
    }

    const tokenValidation =
      this.jsonWebTokenService.verify<JwtPayloadDto>(jwtToken);

    if (!tokenValidation.valid) {
      throw new UnauthorizedException('Invalid access token');
    }

    return tokenValidation.data;
  }
}
