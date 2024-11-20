import { AuthErrorCodeEnum, UnexpectedErrorCodeEnum } from './error.code';

type AuthErrorMessageType = {
  readonly [K in AuthErrorCodeEnum]: string;
};

type UnexpectedErrorMessageType = {
  readonly [K in UnexpectedErrorCodeEnum]: string;
};

export const AuthErrorMessage: AuthErrorMessageType = {
  [AuthErrorCodeEnum.LogoutFailed]: 'Logout failed',
  [AuthErrorCodeEnum.UserNotFound]: 'User not found',
  [AuthErrorCodeEnum.PasswordNotMatch]: 'Password not match',
  [AuthErrorCodeEnum.PasswordHashFailed]: 'Password hash failed',
  [AuthErrorCodeEnum.EmailAlreadyExists]: 'Email already exists',

  [AuthErrorCodeEnum.TokenGenerateFailed]: 'Token generate failed',
  [AuthErrorCodeEnum.TokenCleanupFailed]: 'Token cleanup failed',
  [AuthErrorCodeEnum.RefreshTokenSaveFailed]: 'Refresh token save failed',
  [AuthErrorCodeEnum.InvalidRefreshToken]: 'Invalid refresh token',
  [AuthErrorCodeEnum.ExpiredRefreshToken]: 'Expired refresh token',
  [AuthErrorCodeEnum.RefreshTokenFailed]: 'Refresh token failed',

  [AuthErrorCodeEnum.GoogleOAuthFailed]: 'Google OAuth failed',
  [AuthErrorCodeEnum.GoogleIdTokenVerifyFailed]:
    'Google ID token verify failed',
  [AuthErrorCodeEnum.AppleOAuthFailed]: 'Apple OAuth failed',
  [AuthErrorCodeEnum.AppleIdTokenVerifyFailed]: 'Apple ID token verify failed',
};

export const UnexpectedErrorMessage: UnexpectedErrorMessageType = {
  [UnexpectedErrorCodeEnum.Unexpected]: 'Unexpected error',
};
