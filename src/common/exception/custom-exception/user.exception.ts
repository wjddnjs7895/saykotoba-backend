import { UserErrorCodeEnum } from '@/common/exception/error-constant/error.code';
import { UserErrorMessage } from '@/common/exception/error-constant/error.message';
import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';

export class UserNotFoundException extends CustomBaseException {
  constructor() {
    super(
      UserErrorCodeEnum.UserNotFound,
      HttpStatus.NOT_FOUND,
      UserErrorMessage[UserErrorCodeEnum.UserNotFound],
    );
  }
}

export class UserUpdateFailedException extends CustomBaseException {
  constructor() {
    super(
      UserErrorCodeEnum.UserUpdateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      UserErrorMessage[UserErrorCodeEnum.UserUpdateFailed],
    );
  }
}

export class UserTierUpdateFailedException extends CustomBaseException {
  constructor() {
    super(
      UserErrorCodeEnum.UserTierUpdateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      UserErrorMessage[UserErrorCodeEnum.UserTierUpdateFailed],
    );
  }
}
