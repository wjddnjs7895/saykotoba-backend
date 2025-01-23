import { CustomBaseException } from '../custom.base.exception';
import { ClassroomErrorCodeEnum } from '../error-constant/error.code';
import { ClassroomErrorMessage } from '../error-constant/error.message';
import { HttpStatus } from '@nestjs/common';

export class ClassroomNotFoundException extends CustomBaseException {
  constructor() {
    super(
      ClassroomErrorCodeEnum.ClassroomNotFound,
      HttpStatus.NOT_FOUND,
      ClassroomErrorMessage[ClassroomErrorCodeEnum.ClassroomNotFound],
    );
  }
}
