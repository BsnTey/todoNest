export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum TaskSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TokensStrategy {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}
