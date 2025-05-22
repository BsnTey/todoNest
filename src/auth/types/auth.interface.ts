import { FastifyRequest } from 'fastify';
import { User } from '../../entity/user.entity';

export interface IJWTPayload {
  id: string;
}

export interface CredentialsToken {
  accessToken: string;
  refreshToken: string;
}

export type RequestWithUser = FastifyRequest & {
  user: User;
};
