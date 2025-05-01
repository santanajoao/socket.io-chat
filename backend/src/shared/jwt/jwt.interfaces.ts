import { Request as ExpressRequest } from 'express';
import { IncomingMessage } from 'node:http';
import { Socket } from 'socket.io';

export type JwtPayloadDto = {
  id: string;
  email: string;
  username: string;
};

export type AuthenticatedExpressRequest = ExpressRequest & {
  user: JwtPayloadDto;
};

export type AuthenticatedSocketRequest = IncomingMessage & {
  user: JwtPayloadDto;
};

export type AuthenticatedSocket = Socket & {
  request: AuthenticatedSocketRequest;
};
