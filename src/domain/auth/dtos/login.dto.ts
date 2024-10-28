export class LoginRequestDto {
  email: string;
  password: any;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}
