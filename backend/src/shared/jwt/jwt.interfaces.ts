import { Request as ExpressRequest } from 'express';

export type JwtPayloadDto = {
  id: string;
  email: string;
  username: string;
};

export type AuthenticatedExpressRequest = ExpressRequest & {
  user: JwtPayloadDto;
};
