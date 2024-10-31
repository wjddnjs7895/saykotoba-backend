import { ENTITY_NOT_FOUND, ErrorCode } from './error-code';

export const EntityNotFoundException = (message?: string): CustomException => {
  return new CustomException(ENTITY_NOT_FOUND, message);
};

export class CustomException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    if (!message) {
      message = errorCode.message;
    }

    super(message);

    this.errorCode = errorCode;
  }
}
