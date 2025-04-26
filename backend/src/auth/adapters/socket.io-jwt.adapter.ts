import { INestApplicationContext, Injectable } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import * as cookie from 'cookie';
import { NextFunction } from 'express';
import { JWT_COOKIE_KEY } from '../constants/cookies';
import { JwtValidator } from '../../shared/jwt/jwt.validator';

@Injectable()
export class SocketIoJwtAdapter extends IoAdapter {
  private jwtValidator: JwtValidator;

  constructor(private readonly app: INestApplicationContext) {
    super(app);
    this.jwtValidator = this.app.get(JwtValidator);
  }

  jwtMiddleware = (socket: Socket, next: NextFunction) => {
    const cookieHeader = socket.handshake.headers.cookie ?? '';
    const cookies = cookie.parse(cookieHeader);

    const jwtToken = cookies[JWT_COOKIE_KEY];
    try {
      this.jwtValidator.validate(jwtToken);
    } catch (error) {
      return next(error);
    }

    return next();
  };

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options) as Server;
    server.use(this.jwtMiddleware);
    return server;
  }
}
