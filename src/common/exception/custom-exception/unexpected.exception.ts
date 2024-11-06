import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../custom.exception';
import { UnexpectedErrorCodeEnum } from '../error-constant/error.code';

export class UnexpectedException extends CustomException {
  constructor() {
    super(UnexpectedErrorCodeEnum.Unexpected, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
