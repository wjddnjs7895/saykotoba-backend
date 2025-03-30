import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { RepositoryErrorCodeEnum } from '../error-constant/error.code';
import { RepositoryErrorMessage } from '../error-constant/error.message';

export class EntityNotFoundException extends CustomBaseException {
  constructor() {
    super(
      RepositoryErrorCodeEnum.EntityNotFound,
      HttpStatus.INTERNAL_SERVER_ERROR,
      RepositoryErrorMessage[RepositoryErrorCodeEnum.EntityNotFound],
    );
  }
}

export class SaveFailedException extends CustomBaseException {
  constructor() {
    super(
      RepositoryErrorCodeEnum.SaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      RepositoryErrorMessage[RepositoryErrorCodeEnum.SaveFailed],
    );
  }
}

export class DeleteFailedException extends CustomBaseException {
  constructor() {
    super(
      RepositoryErrorCodeEnum.DeleteFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      RepositoryErrorMessage[RepositoryErrorCodeEnum.DeleteFailed],
    );
  }
}

export class UpdateFailedException extends CustomBaseException {
  constructor() {
    super(
      RepositoryErrorCodeEnum.UpdateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      RepositoryErrorMessage[RepositoryErrorCodeEnum.UpdateFailed],
    );
  }
}
