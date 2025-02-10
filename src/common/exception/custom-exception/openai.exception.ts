import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { OpenAIErrorCodeEnum } from '../error-constant/error.code';
import { OpenAIErrorMessage } from '../error-constant/error.message';

export class NoToolResponseReceivedException extends CustomBaseException {
  constructor() {
    super(
      OpenAIErrorCodeEnum.NoToolResponseReceived,
      HttpStatus.INTERNAL_SERVER_ERROR,
      OpenAIErrorMessage[OpenAIErrorCodeEnum.NoToolResponseReceived],
    );
  }
}

export class OpenAICreateFailedException extends CustomBaseException {
  constructor() {
    super(
      OpenAIErrorCodeEnum.OpenAICreateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      OpenAIErrorMessage[OpenAIErrorCodeEnum.OpenAICreateFailed],
    );
  }
}

export class BufferToFileFailedException extends CustomBaseException {
  constructor() {
    super(
      OpenAIErrorCodeEnum.BufferToFileFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      OpenAIErrorMessage[OpenAIErrorCodeEnum.BufferToFileFailed],
    );
  }
}
