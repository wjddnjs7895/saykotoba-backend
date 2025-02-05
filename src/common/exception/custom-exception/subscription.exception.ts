import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { SubscriptionErrorCodeEnum } from '../error-constant/error.code';
import { SubscriptionErrorMessage } from '../error-constant/error.message';

export class SubscriptionUnauthorizedException extends CustomBaseException {
  constructor() {
    super(
      SubscriptionErrorCodeEnum.UnauthorizedSubscription,
      HttpStatus.UNAUTHORIZED,
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
