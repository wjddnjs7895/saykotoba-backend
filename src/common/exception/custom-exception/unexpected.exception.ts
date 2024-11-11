import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { UnexpectedErrorCodeEnum } from '../error-constant/error.code';

export class UnexpectedException extends CustomBaseException {
  constructor() {
    super(UnexpectedErrorCodeEnum.Unexpected, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
