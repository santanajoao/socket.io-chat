import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedExpressRequest } from '../interfaces/jwt.interfaces';
import { IS_PUBLIC_KEY } from '../constants/decorators';
import { Reflector } from '@nestjs/core';
import { JWT_COOKIE_KEY } from '../constants/cookies';
import { JwtValidator } from '../jwt.validator';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtValidator: JwtValidator,
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

    const jwtToken = treatedCookies[JWT_COOKIE_KEY];
    const payload = this.jwtValidator.validate(jwtToken);

    request.user = payload;

    return true;
  }
}
