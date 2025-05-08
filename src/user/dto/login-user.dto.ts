export interface LoginUserDto {
  email: string;
  password: string;
}

export interface CredentialsUserDto {
  accessToken: string;
  refreshToken: string;
}
