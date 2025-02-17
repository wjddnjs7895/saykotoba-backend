export enum AuthErrorCodeEnum {
  LogoutFailed = 'AUTH00',
  UserNotFound = 'AUTH01',
  PasswordNotMatch = 'AUTH02',
  PasswordHashFailed = 'AUTH03',
  EmailAlreadyExists = 'AUTH04',

  TokenGenerateFailed = 'AUTH10',
  TokenCleanupFailed = 'AUTH11',
  InvalidAccessToken = 'AUTH12',
  ExpiredAccessToken = 'AUTH13',
  RefreshTokenSaveFailed = 'AUTH14',
  InvalidRefreshToken = 'AUTH15',
  ExpiredRefreshToken = 'AUTH16',
  RefreshTokenFailed = 'AUTH17',
  UnauthorizedToken = 'AUTH18',

  GoogleOAuthFailed = 'AUTH20',
  GoogleIdTokenVerifyFailed = 'AUTH21',
  AppleOAuthFailed = 'AUTH22',
  AppleIdTokenVerifyFailed = 'AUTH23',

  AdminUnauthorized = 'AUTH99',
}

export enum ConversationErrorCodeEnum {
  ConversationNotFound = 'CONV01',
  MessageNotFound = 'CONV02',
  ConversationSaveFailed = 'CONV03',
  MissionSaveFailed = 'CONV04',
  MessageSaveFailed = 'CONV05',
  MissionNotFound = 'CONV06',
  HintCountExceeded = 'CONV07',
  MessageDeleteFailed = 'CONV08',
  FeedbackSaveFailed = 'CONV09',
  ConversationUpdateFailed = 'CONV10',
  FeedbackNotFound = 'CONV11',
  MissionNotCompleted = 'CONV12',
  ConversationGroupNotFound = 'CONV13',
  ConversationGroupSaveFailed = 'CONV14',
  AudioGenerationFailed = 'CONV15',
}

export enum LectureErrorCodeEnum {
  LectureNotFound = 'LECT01',
  LectureSaveFailed = 'LECT02',
  LessonNotFound = 'LECT03',
  LessonSaveFailed = 'LECT04',
  LessonDeleteFailed = 'LECT05',
  LectureDeleteFailed = 'LECT06',
}

export enum ClassroomErrorCodeEnum {
  ClassroomNotFound = 'CLRM01',
  ClassroomSaveFailed = 'CLRM02',
  ClassroomGenerateFailed = 'CLRM03',
}

export enum CharacterErrorCodeEnum {
  CharacterNotFound = 'CHRT01',
  CharacterSaveFailed = 'CHRT02',
}

export enum UserErrorCodeEnum {
  UserNotFound = 'USER01',
  UserUpdateFailed = 'USER02',
  UserTierUpdateFailed = 'USER03',
}

export enum OpenAIErrorCodeEnum {
  NoToolResponseReceived = 'OPAI01',
  OpenAICreateFailed = 'OPAI02',
  BufferToFileFailed = 'OPAI03',
}

export enum GoogleErrorCodeEnum {
  GoogleTTSFailed = 'GGLE01',
}

export enum SubscriptionErrorCodeEnum {
  UnauthorizedSubscription = 'SUBS01',
  SubscriptionNotFound = 'SUBS02',
  SubscriptionSaveFailed = 'SUBS03',
  SubscriptionUpdateFailed = 'SUBS04',
  SubscriptionDeleteFailed = 'SUBS05',
}

export enum UnexpectedErrorCodeEnum {
  Unexpected = 'UNEX99',
}
