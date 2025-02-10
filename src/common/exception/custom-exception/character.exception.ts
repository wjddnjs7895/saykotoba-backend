import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { CharacterErrorCodeEnum } from '../error-constant/error.code';
import { CharacterErrorMessage } from '../error-constant/error.message';

export class CharacterNotFoundException extends CustomBaseException {
  constructor() {
    super(
      CharacterErrorCodeEnum.CharacterNotFound,
      HttpStatus.NOT_FOUND,
      CharacterErrorMessage[CharacterErrorCodeEnum.CharacterNotFound],
    );
  }
}

export class CharacterSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      CharacterErrorCodeEnum.CharacterSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      CharacterErrorMessage[CharacterErrorCodeEnum.CharacterSaveFailed],
    );
  }
}
