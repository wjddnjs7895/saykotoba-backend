import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { AuthErrorCodeEnum } from '../error-constant/error.code';
import { AuthErrorMessage } from '../error-constant/error.message';

export class UserNotFoundException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.UserNotFound,
      HttpStatus.NOT_FOUND,
      AuthErrorMessage[AuthErrorCodeEnum.UserNotFound],
    );
  }
}

export class PasswordNotMatchException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.PasswordNotMatch,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage[AuthErrorCodeEnum.PasswordNotMatch],
    );
  }
}

export class RefreshTokenSaveException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.RefreshTokenSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage[AuthErrorCodeEnum.RefreshTokenSaveFailed],
    );
  }
}

export class InvalidAccessTokenException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.InvalidAccessToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage[AuthErrorCodeEnum.InvalidAccessToken],
    );
  }
}

export class ExpiredAccessTokenException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.ExpiredAccessToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage[AuthErrorCodeEnum.ExpiredAccessToken],
    );
  }
}

export class InvalidRefreshTokenException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.InvalidRefreshToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage[AuthErrorCodeEnum.InvalidRefreshToken],
    );
  }
}

export class ExpiredRefreshTokenException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.ExpiredRefreshToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage[AuthErrorCodeEnum.ExpiredRefreshToken],
    );
  }
}

export class RefreshTokenFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.RefreshTokenFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage[AuthErrorCodeEnum.RefreshTokenFailed],
    );
  }
}

export class LogoutFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.LogoutFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage[AuthErrorCodeEnum.LogoutFailed],
    );
  }
}

export class EmailAlreadyExistsException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.EmailAlreadyExists,
      HttpStatus.CONFLICT,
      AuthErrorMessage[AuthErrorCodeEnum.EmailAlreadyExists],
    );
  }
}

export class PasswordHashFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.PasswordHashFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage[AuthErrorCodeEnum.PasswordHashFailed],
    );
  }
}

export class TokenGenerateFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.TokenGenerateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage[AuthErrorCodeEnum.TokenGenerateFailed],
    );
  }
}

export class TokenCleanupFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.TokenCleanupFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage[AuthErrorCodeEnum.TokenCleanupFailed],
    );
  }
}

export class GoogleOAuthFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.GoogleOAuthFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage[AuthErrorCodeEnum.GoogleOAuthFailed],
    );
  }
}

export class AppleOAuthFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.AppleOAuthFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      AuthErrorMessage[AuthErrorCodeEnum.AppleOAuthFailed],
    );
  }
}

export class GoogleIdTokenVerifyFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.GoogleIdTokenVerifyFailed,
      HttpStatus.BAD_REQUEST,
      AuthErrorMessage[AuthErrorCodeEnum.GoogleIdTokenVerifyFailed],
    );
  }
}

export class AppleIdTokenVerifyFailedException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.AppleIdTokenVerifyFailed,
      HttpStatus.BAD_REQUEST,
      AuthErrorMessage[AuthErrorCodeEnum.AppleIdTokenVerifyFailed],
    );
  }
}

export class UnauthorizedTokenException extends CustomBaseException {
  constructor() {
    super(
      AuthErrorCodeEnum.UnauthorizedToken,
      HttpStatus.UNAUTHORIZED,
      AuthErrorMessage[AuthErrorCodeEnum.UnauthorizedToken],
    );
  }
}
