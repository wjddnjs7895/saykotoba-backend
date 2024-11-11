import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { AuthErrorCodeEnum } from '../error-constant/error.code';
import { AuthErrorMessage } from '../error-constant/error.message';

export class UserNotFoundException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.UserNotFound,
      HttpStatus.NOT_FOUND,
      AuthErrorMessage.UserNotFound,
    );
  }
}

export class PasswordNotMatchException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.PasswordNotMatch,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage.PasswordNotMatch,
    );
  }
}

export class RefreshTokenSaveException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.RefreshTokenSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.RefreshTokenSaveFailed,
    );
  }
}

export class InvalidRefreshTokenException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.InvalidRefreshToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage.InvalidRefreshToken,
    );
  }
}

export class ExpiredRefreshTokenException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.ExpiredRefreshToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage.ExpiredRefreshToken,
    );
  }
}

export class RefreshTokenFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.RefreshTokenFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.RefreshTokenFailed,
    );
  }
}

export class LogoutFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.LogoutFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.LogoutFailed,
    );
  }
}

export class EmailAlreadyExistsException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.EmailAlreadyExists,
      HttpStatus.CONFLICT,
      AuthErrorMessage.EmailAlreadyExists,
    );
  }
}

export class PasswordHashFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.PasswordHashFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.PasswordHashFailed,
    );
  }
}

export class TokenGenerateFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.TokenGenerateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.TokenGenerateFailed,
    );
  }
}

export class TokenCleanupFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.TokenCleanupFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.TokenCleanupFailed,
    );
  }
}

export class GoogleOAuthFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.GoogleOAuthFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.GoogleOAuthFailed,
    );
  }
}

export class AppleOAuthFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.AppleOAuthFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.AppleOAuthFailed,
    );
  }
}

export class GoogleIdTokenVerifyFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.GoogleIdTokenVerifyFailed,
      HttpStatus.BAD_REQUEST,
      AuthErrorMessage.GoogleIdTokenVerifyFailed,
    );
  }
}

export class AppleIdTokenVerifyFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.AppleIdTokenVerifyFailed,
      HttpStatus.BAD_REQUEST,
      AuthErrorMessage.AppleIdTokenVerifyFailed,
    );
  }
}
