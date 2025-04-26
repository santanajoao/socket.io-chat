import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenService } from 'src/shared/jwt/jsonwebtoken.service';
import {
  AuthenticatedExpressRequest,
  JwtPayloadDto,
} from '../interfaces/jwt.interfaces';
import { IS_PUBLIC_KEY } from '../constants/decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jsonWebTokenService: JsonWebTokenService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic === true) return true;

    const request: AuthenticatedExpressRequest = context
      .switchToHttp()
      .getRequest();

    const treatedCookies: Record<string, string | undefined> =
      request.cookies ?? {};

    const jwtToken = treatedCookies['accessToken'];
    if (!jwtToken) {
      throw new UnauthorizedException('Missing access token');
    }

    const tokenValidation =
      this.jsonWebTokenService.verify<JwtPayloadDto>(jwtToken);

    if (!tokenValidation.valid) {
      throw new UnauthorizedException('Invalid access token');
    }

    const payload = tokenValidation.data;
    request.user = payload;

    return true;
  }
}
