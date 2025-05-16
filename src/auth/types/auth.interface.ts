import { UserRole } from '../../common';

export interface IJWTPayload {
  id: string;
  role: UserRole;
}

export interface CredentialsToken {
  accessToken: string;
  refreshToken: string;
}
