import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { LectureErrorCodeEnum } from '../error-constant/error.code';
import { LectureErrorMessage } from '../error-constant/error.message';

export class LectureNotFoundException extends CustomBaseException {
  constructor() {
    super(
      LectureErrorCodeEnum.LectureNotFound,
      HttpStatus.NOT_FOUND,
      LectureErrorMessage[LectureErrorCodeEnum.LectureNotFound],
    );
  }
}

export class LectureSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      LectureErrorCodeEnum.LectureSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      LectureErrorMessage[LectureErrorCodeEnum.LectureSaveFailed],
    );
  }
}

export class LessonNotFoundException extends CustomBaseException {
  constructor() {
    super(
      LectureErrorCodeEnum.LessonNotFound,
      HttpStatus.NOT_FOUND,
      LectureErrorMessage[LectureErrorCodeEnum.LessonNotFound],
    );
  }
}
