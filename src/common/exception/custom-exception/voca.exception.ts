import { VocaErrorCodeEnum } from '@/common/exception/error-constant/error.code';
import { VocaErrorMessage } from '@/common/exception/error-constant/error.message';
import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';

export class VocaNotFoundException extends CustomBaseException {
  constructor() {
    super(
      VocaErrorCodeEnum.VocaNotFound,
      HttpStatus.NOT_FOUND,
      VocaErrorMessage[VocaErrorCodeEnum.VocaNotFound],
    );
  }
}

export class VocaSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      VocaErrorCodeEnum.VocaSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      VocaErrorMessage[VocaErrorCodeEnum.VocaSaveFailed],
    );
  }
}

export class VocaDeleteFailedException extends CustomBaseException {
  constructor() {
    super(
      VocaErrorCodeEnum.VocaDeleteFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      VocaErrorMessage[VocaErrorCodeEnum.VocaDeleteFailed],
    );
  }
}

export class VocaUpdateFailedException extends CustomBaseException {
  constructor() {
    super(
      VocaErrorCodeEnum.VocaUpdateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      VocaErrorMessage[VocaErrorCodeEnum.VocaUpdateFailed],
    );
  }
}

export class InvalidDifficultyException extends CustomBaseException {
  constructor() {
    super(
      VocaErrorCodeEnum.InvalidDifficulty,
      HttpStatus.BAD_REQUEST,
      VocaErrorMessage[VocaErrorCodeEnum.InvalidDifficulty],
    );
  }
}
