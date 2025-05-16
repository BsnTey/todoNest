import { UserRole } from '../../common';

export interface UserContext {
  userId: string;
  userRole: UserRole;
}
