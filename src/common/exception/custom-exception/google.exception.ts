import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { GoogleErrorCodeEnum } from '../error-constant/error.code';
import { GoogleErrorMessage } from '../error-constant/error.message';

export class GoogleTTSFailedException extends CustomBaseException {
  constructor() {
    super(
      GoogleErrorCodeEnum.GoogleTTSFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      GoogleErrorMessage[GoogleErrorCodeEnum.GoogleTTSFailed],
    );
  }
}
