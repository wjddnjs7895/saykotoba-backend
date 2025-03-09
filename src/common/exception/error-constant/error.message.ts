import {
  AuthErrorCodeEnum,
  CharacterErrorCodeEnum,
  ClassroomErrorCodeEnum,
  ConversationErrorCodeEnum,
  GoogleErrorCodeEnum,
  LectureErrorCodeEnum,
  OpenAIErrorCodeEnum,
  SubscriptionErrorCodeEnum,
  UnexpectedErrorCodeEnum,
  UserErrorCodeEnum,
} from './error.code';

type AuthErrorMessageType = {
  readonly [K in AuthErrorCodeEnum]: string;
};

type ConversationErrorMessageType = {
  readonly [K in ConversationErrorCodeEnum]: string;
};

type LectureErrorMessageType = {
  readonly [K in LectureErrorCodeEnum]: string;
};

type ClassroomErrorMessageType = {
  readonly [K in ClassroomErrorCodeEnum]: string;
};

type CharacterErrorMessageType = {
  readonly [K in CharacterErrorCodeEnum]: string;
};

type UserErrorMessageType = {
  readonly [K in UserErrorCodeEnum]: string;
};

type UnexpectedErrorMessageType = {
  readonly [K in UnexpectedErrorCodeEnum]: string;
};

type GoogleErrorMessageType = {
  readonly [K in GoogleErrorCodeEnum]: string;
};

type SubscriptionErrorMessageType = {
  readonly [K in SubscriptionErrorCodeEnum]: string;
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

  [AuthErrorCodeEnum.AdminUnauthorized]: 'Admin unauthorized',
};

export const ConversationErrorMessage: ConversationErrorMessageType = {
  [ConversationErrorCodeEnum.ConversationNotFound]: 'Conversation not found',
  [ConversationErrorCodeEnum.MessageNotFound]: 'Message not found',
  [ConversationErrorCodeEnum.ConversationSaveFailed]:
    'Conversation save failed',
  [ConversationErrorCodeEnum.MissionSaveFailed]: 'Mission save failed',
  [ConversationErrorCodeEnum.MessageSaveFailed]: 'Message save failed',
  [ConversationErrorCodeEnum.MissionNotFound]: 'Mission not found',
  [ConversationErrorCodeEnum.HintCountExceeded]: 'Hint count exceeded',
  [ConversationErrorCodeEnum.MessageDeleteFailed]: 'Message delete failed',
  [ConversationErrorCodeEnum.FeedbackSaveFailed]: 'Feedback save failed',
  [ConversationErrorCodeEnum.ConversationUpdateFailed]:
    'Conversation update failed',
  [ConversationErrorCodeEnum.FeedbackNotFound]: 'Feedback not found',
  [ConversationErrorCodeEnum.MissionNotCompleted]: 'Mission not completed',
  [ConversationErrorCodeEnum.ConversationGroupNotFound]:
    'Conversation group not found',
  [ConversationErrorCodeEnum.ConversationGroupSaveFailed]:
    'Conversation group save failed',
  [ConversationErrorCodeEnum.AudioGenerationFailed]: 'Audio generation failed',
};

export const LectureErrorMessage: LectureErrorMessageType = {
  [LectureErrorCodeEnum.LectureNotFound]: 'Lecture not found',
  [LectureErrorCodeEnum.LectureSaveFailed]: 'Lecture save failed',
  [LectureErrorCodeEnum.LessonNotFound]: 'Lesson not found',
  [LectureErrorCodeEnum.LessonSaveFailed]: 'Lesson save failed',
  [LectureErrorCodeEnum.LessonDeleteFailed]: 'Lesson delete failed',
  [LectureErrorCodeEnum.LectureDeleteFailed]: 'Lecture delete failed',
};

export const ClassroomErrorMessage: ClassroomErrorMessageType = {
  [ClassroomErrorCodeEnum.ClassroomNotFound]: 'Classroom not found',
  [ClassroomErrorCodeEnum.ClassroomSaveFailed]: 'Classroom save failed',
  [ClassroomErrorCodeEnum.ClassroomGenerateFailed]: 'Classroom generate failed',
};

export const CharacterErrorMessage: CharacterErrorMessageType = {
  [CharacterErrorCodeEnum.CharacterNotFound]: 'Character not found',
  [CharacterErrorCodeEnum.CharacterSaveFailed]: 'Character save failed',
};

export const UserErrorMessage: UserErrorMessageType = {
  [UserErrorCodeEnum.UserNotFound]: 'User not found',
  [UserErrorCodeEnum.UserUpdateFailed]: 'User update failed',
  [UserErrorCodeEnum.UserTierUpdateFailed]: 'User tier update failed',
};

export const OpenAIErrorMessage: OpenAIErrorMessageType = {
  [OpenAIErrorCodeEnum.NoToolResponseReceived]: 'No tool response received',
  [OpenAIErrorCodeEnum.OpenAICreateFailed]: 'OpenAI create failed',
  [OpenAIErrorCodeEnum.BufferToFileFailed]: 'Buffer to file failed',
};

export const GoogleErrorMessage: GoogleErrorMessageType = {
  [GoogleErrorCodeEnum.GoogleTTSFailed]: 'Google TTS failed',
};

export const SubscriptionErrorMessage: SubscriptionErrorMessageType = {
  [SubscriptionErrorCodeEnum.SubscriptionNotFound]: 'Subscription not found',
  [SubscriptionErrorCodeEnum.SubscriptionSaveFailed]:
    'Subscription save failed',
  [SubscriptionErrorCodeEnum.SubscriptionUpdateFailed]:
    'Subscription update failed',
  [SubscriptionErrorCodeEnum.SubscriptionDeleteFailed]:
    'Subscription delete failed',
  [SubscriptionErrorCodeEnum.SubscriptionExpired]: 'Subscription expired',
  [SubscriptionErrorCodeEnum.UnauthorizedSubscription]:
    'Unauthorized subscription',
  [SubscriptionErrorCodeEnum.InvalidReceipt]: 'Invalid receipt',
  [SubscriptionErrorCodeEnum.AppleWebhookFailed]: 'Apple webhook failed',
  [SubscriptionErrorCodeEnum.AppleReceiptDecodeFailed]:
    'Apple receipt decode failed',
  [SubscriptionErrorCodeEnum.AppleReceiptNotFound]: 'Apple receipt not found',
  [SubscriptionErrorCodeEnum.PendingWebhookFailed]: 'Pending webhook failed',
};

export const UnexpectedErrorMessage: UnexpectedErrorMessageType = {
  [UnexpectedErrorCodeEnum.Unexpected]: 'Unexpected error',
};
