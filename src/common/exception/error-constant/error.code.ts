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
  LectureNotFound = 'LECTURE01',
  LectureSaveFailed = 'LECTURE02',
  LessonNotFound = 'LECTURE03',
  LessonSaveFailed = 'LECTURE04',
  LessonDeleteFailed = 'LECTURE05',
  LectureDeleteFailed = 'LECTURE06',
}

export enum ClassroomErrorCodeEnum {
  ClassroomNotFound = 'CLASSROOM01',
  ClassroomSaveFailed = 'CLASSROOM02',
  ClassroomGenerateFailed = 'CLASSROOM03',
}

export enum CharacterErrorCodeEnum {
  CharacterNotFound = 'CHARACTER01',
  CharacterSaveFailed = 'CHARACTER02',
}

export enum UserErrorCodeEnum {
  UserNotFound = 'USER01',
  UserUpdateFailed = 'USER02',
}

export enum OpenAIErrorCodeEnum {
  NoToolResponseReceived = 'OPENAI01',
  OpenAICreateFailed = 'OPENAI02',
  BufferToFileFailed = 'OPENAI03',
}

export enum GoogleErrorCodeEnum {
  GoogleTTSFailed = 'GOOGLE01',
}

export enum UnexpectedErrorCodeEnum {
  Unexpected = 'UNEXP99',
}
