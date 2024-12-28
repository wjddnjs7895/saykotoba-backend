import {
  AuthErrorCodeEnum,
  ConversationErrorCodeEnum,
  OpenAIErrorCodeEnum,
  UnexpectedErrorCodeEnum,
} from './error.code';

type AuthErrorMessageType = {
  readonly [K in AuthErrorCodeEnum]: string;
};

type ConversationErrorMessageType = {
  readonly [K in ConversationErrorCodeEnum]: string;
};

type UnexpectedErrorMessageType = {
  readonly [K in UnexpectedErrorCodeEnum]: string;
};

type OpenAIErrorMessageType = {
  readonly [K in OpenAIErrorCodeEnum]: string;
};

export const AuthErrorMessage: AuthErrorMessageType = {
  [AuthErrorCodeEnum.LogoutFailed]: 'Logout failed',
  [AuthErrorCodeEnum.UserNotFound]: 'User not found',
  [AuthErrorCodeEnum.PasswordNotMatch]: 'Password not match',
  [AuthErrorCodeEnum.PasswordHashFailed]: 'Password hash failed',
  [AuthErrorCodeEnum.EmailAlreadyExists]: 'Email already exists',

  [AuthErrorCodeEnum.TokenGenerateFailed]: 'Token generate failed',
  [AuthErrorCodeEnum.TokenCleanupFailed]: 'Token cleanup failed',
  [AuthErrorCodeEnum.InvalidAccessToken]: 'Invalid access token',
  [AuthErrorCodeEnum.ExpiredAccessToken]: 'Expired access token',
  [AuthErrorCodeEnum.RefreshTokenSaveFailed]: 'Refresh token save failed',
  [AuthErrorCodeEnum.InvalidRefreshToken]: 'Invalid refresh token',
  [AuthErrorCodeEnum.ExpiredRefreshToken]: 'Expired refresh token',
  [AuthErrorCodeEnum.RefreshTokenFailed]: 'Refresh token failed',

  [AuthErrorCodeEnum.GoogleOAuthFailed]: 'Google OAuth failed',
  [AuthErrorCodeEnum.GoogleIdTokenVerifyFailed]:
    'Google ID token verify failed',
  [AuthErrorCodeEnum.AppleOAuthFailed]: 'Apple OAuth failed',
  [AuthErrorCodeEnum.AppleIdTokenVerifyFailed]: 'Apple ID token verify failed',
  [AuthErrorCodeEnum.UnauthorizedToken]: 'Unauthorized token',
};

export const ConversationErrorMessage: ConversationErrorMessageType = {
  [ConversationErrorCodeEnum.ConversationNotFound]: 'Conversation not found',
  [ConversationErrorCodeEnum.MessageNotFound]: 'Message not found',
  [ConversationErrorCodeEnum.ConversationSaveFailed]:
    'Conversation save failed',
  [ConversationErrorCodeEnum.MissionSaveFailed]: 'Mission save failed',
  [ConversationErrorCodeEnum.MessageSaveFailed]: 'Message save failed',
  [ConversationErrorCodeEnum.MissionNotFound]: 'Mission not found',
};

export const OpenAIErrorMessage: OpenAIErrorMessageType = {
  [OpenAIErrorCodeEnum.NoToolResponseReceived]: 'No tool response received',
  [OpenAIErrorCodeEnum.OpenAICreateFailed]: 'OpenAI create failed',
  [OpenAIErrorCodeEnum.BufferToFileFailed]: 'Buffer to file failed',
};

export const UnexpectedErrorMessage: UnexpectedErrorMessageType = {
  [UnexpectedErrorCodeEnum.Unexpected]: 'Unexpected error',
};
