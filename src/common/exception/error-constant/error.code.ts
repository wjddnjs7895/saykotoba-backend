export enum AuthErrorCodeEnum {
  LogoutFailed = 'AUTH00',
  UserNotFound = 'AUTH01',
  PasswordNotMatch = 'AUTH02',
  PasswordHashFailed = 'AUTH03',
  EmailAlreadyExists = 'AUTH04',

  TokenGenerateFailed = 'AUTH10',
  TokenCleanupFailed = 'AUTH11',
  RefreshTokenSaveFailed = 'AUTH12',
  InvalidRefreshToken = 'AUTH13',
  ExpiredRefreshToken = 'AUTH14',
  RefreshTokenFailed = 'AUTH15',

  GoogleOAuthFailed = 'AUTH20',
  GoogleIdTokenVerifyFailed = 'AUTH21',
  AppleOAuthFailed = 'AUTH22',
  AppleIdTokenVerifyFailed = 'AUTH23',
}

export enum UnexpectedErrorCodeEnum {
  Unexpected = 'UNEXP99',
}
