import { INestApplicationContext, Injectable } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import * as cookie from 'cookie';
import { JWT_COOKIE_KEY } from '../constants/cookies';
import { JwtValidator } from '../../shared/jwt/jwt.validator';
import { AuthenticatedSocketRequest } from 'src/shared/jwt/jwt.interfaces';

@Injectable()
export class SocketIoJwtAdapter extends IoAdapter {
  private jwtValidator: JwtValidator;

  constructor(private readonly app: INestApplicationContext) {
    super(app);
    this.jwtValidator = this.app.get(JwtValidator);
  }

  allowRequest: ServerOptions['allowRequest'] = (
    req: AuthenticatedSocketRequest,
    callback,
  ) => {
    try {
      const cookieHeader = req.headers.cookie ?? '';
      const cookies = cookie.parse(cookieHeader);

      const jwtToken = cookies[JWT_COOKIE_KEY];
      const data = this.jwtValidator.validate(jwtToken);

      req.user = data;

      return callback(null, true);
    } catch (error) {
      let errorMessage = 'Authentication error';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return callback(errorMessage, false);
    }
  };

  createIOServer = (port: number, options: ServerOptions) => {
    const treatedOptions: ServerOptions = {
      ...options,
      allowRequest: this.allowRequest,
    };

    const server = super.createIOServer(port, treatedOptions) as Server;

    return server;
  };
}
