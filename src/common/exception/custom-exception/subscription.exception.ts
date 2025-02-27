import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { SubscriptionErrorCodeEnum } from '../error-constant/error.code';
import { SubscriptionErrorMessage } from '../error-constant/error.message';

export class SubscriptionUnauthorizedException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.UnauthorizedSubscription,
      HttpStatus.FORBIDDEN,
      SubscriptionErrorMessage[
        SubscriptionErrorCodeEnum.UnauthorizedSubscription
      ],
    );
  }
}

export class SubscriptionSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.SubscriptionSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      SubscriptionErrorMessage[
        SubscriptionErrorCodeEnum.SubscriptionSaveFailed
      ],
    );
  }
}

export class SubscriptionUpdateFailedException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.SubscriptionUpdateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      SubscriptionErrorMessage[
        SubscriptionErrorCodeEnum.SubscriptionUpdateFailed
      ],
    );
  }
}

export class SubscriptionDeleteFailedException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.SubscriptionDeleteFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      SubscriptionErrorMessage[
        SubscriptionErrorCodeEnum.SubscriptionDeleteFailed
      ],
    );
  }
}

export class InvalidReceiptException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.InvalidReceipt,
      HttpStatus.BAD_REQUEST,
      SubscriptionErrorMessage[SubscriptionErrorCodeEnum.InvalidReceipt],
    );
  }
}

export class SubscriptionNotFoundException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.SubscriptionNotFound,
      HttpStatus.NOT_FOUND,
      SubscriptionErrorMessage[SubscriptionErrorCodeEnum.SubscriptionNotFound],
    );
  }
}

export class AppleWebhookFailedException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.AppleWebhookFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      SubscriptionErrorMessage[SubscriptionErrorCodeEnum.AppleWebhookFailed],
    );
  }
}

export class AppleReceiptDecodeFailedException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.AppleReceiptDecodeFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      SubscriptionErrorMessage[
        SubscriptionErrorCodeEnum.AppleReceiptDecodeFailed
      ],
    );
  }
}
