export enum AuthErrorCodeEnum {
  UserNotFound = 'AUTH01',
  PasswordNotMatch = 'AUTH02',
  RefreshTokenSaveFailed = 'AUTH03',
  InvalidRefreshToken = 'AUTH04',
  ExpiredRefreshToken = 'AUTH05',
  RefreshTokenFailed = 'AUTH06',
  LogoutFailed = 'AUTH07',
  EmailAlreadyExists = 'AUTH09',
  PasswordHashFailed = 'AUTH10',
  TokenGenerateFailed = 'AUTH11',
  TokenCleanupFailed = 'AUTH12',
  GoogleOAuthFailed = 'AUTH13',
  AppleOAuthFailed = 'AUTH14',
  GoogleIdTokenVerifyFailed = 'AUTH15',
  AppleIdTokenVerifyFailed = 'AUTH16',
}

export enum UnexpectedErrorCodeEnum {
  Unexpected = 'UNEXP99',
}
