export enum AuthErrorCodeEnum {
  UserNotFound = 'AUTH01',
  PasswordNotMatch = 'AUTH02',
  PasswordHashFailed = 'AUTH03',
  EmailAlreadyExists = 'AUTH04',

  TokenGenerateFailed = 'AUTH05',
  TokenCleanupFailed = 'AUTH06',
  RefreshTokenSaveFailed = 'AUTH07',
  InvalidRefreshToken = 'AUTH08',
  ExpiredRefreshToken = 'AUTH09',
  RefreshTokenFailed = 'AUTH10',

  LogoutFailed = 'AUTH11',

  GoogleOAuthFailed = 'AUTH12',
  GoogleIdTokenVerifyFailed = 'AUTH13',
  AppleOAuthFailed = 'AUTH14',
  AppleIdTokenVerifyFailed = 'AUTH15',
}

export enum UnexpectedErrorCodeEnum {
  Unexpected = 'UNEXP99',
}
