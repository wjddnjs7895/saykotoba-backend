import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../custom.exception';
import { AuthErrorCodeEnum } from '../error-constant/error.code';
import { AuthErrorMessage } from '../error-constant/error.message';

export class UserNotFoundException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.UserNotFound,
      HttpStatus.NOT_FOUND,
      AuthErrorMessage.UserNotFound,
    );
  }
}

export class PasswordNotMatchException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.PasswordNotMatch,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage.PasswordNotMatch,
    );
  }
}

export class RefreshTokenSaveException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.RefreshTokenSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.RefreshTokenSaveFailed,
    );
  }
}

export class InvalidRefreshTokenException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.InvalidRefreshToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage.InvalidRefreshToken,
    );
  }
}

export class ExpiredRefreshTokenException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.ExpiredRefreshToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage.ExpiredRefreshToken,
    );
  }
}

export class RefreshTokenFailedException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.RefreshTokenFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.RefreshTokenFailed,
    );
  }
}

export class LogoutFailedException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.LogoutFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.LogoutFailed,
    );
  }
}

export class RegisterFailedException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.RegisterFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.RegisterFailed,
    );
  }
}

export class EmailAlreadyExistsException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.EmailAlreadyExists,
      HttpStatus.CONFLICT,
      AuthErrorMessage.EmailAlreadyExists,
    );
  }
}

export class PasswordHashFailedException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.PasswordHashFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.PasswordHashFailed,
    );
  }
}

export class TokenGenerateFailedException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.TokenGenerateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.TokenGenerateFailed,
    );
  }
}

export class TokenCleanupFailedException extends CustomException {
  constructor() {
    super(
      AuthErrorCodeEnum.TokenCleanupFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage.TokenCleanupFailed,
    );
  }
}
