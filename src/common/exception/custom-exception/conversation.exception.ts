import { HttpStatus } from '@nestjs/common';
import { CustomBaseException } from '../custom.base.exception';
import { ConversationErrorCodeEnum } from '../error-constant/error.code';
import { ConversationErrorMessage } from '../error-constant/error.message';

export class ConversationNotFoundException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.ConversationNotFound,
      HttpStatus.NOT_FOUND,
      ConversationErrorMessage[ConversationErrorCodeEnum.ConversationNotFound],
    );
  }
}

export class MessageNotFoundException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.MessageNotFound,
      HttpStatus.NOT_FOUND,
      ConversationErrorMessage[ConversationErrorCodeEnum.MessageNotFound],
    );
  }
}

export class ConversationSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.ConversationSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ConversationErrorMessage[
        ConversationErrorCodeEnum.ConversationSaveFailed
      ],
    );
  }
}

export class MissionSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.MissionSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ConversationErrorMessage[ConversationErrorCodeEnum.MissionSaveFailed],
    );
  }
}

export class MessageSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.MessageSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ConversationErrorMessage[ConversationErrorCodeEnum.MessageSaveFailed],
    );
  }
}

export class MissionNotFoundException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.MissionNotFound,
      HttpStatus.NOT_FOUND,
      ConversationErrorMessage[ConversationErrorCodeEnum.MissionNotFound],
    );
  }
}

export class HintCountExceededException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.HintCountExceeded,
      HttpStatus.BAD_REQUEST,
      ConversationErrorMessage[ConversationErrorCodeEnum.HintCountExceeded],
    );
  }
}

export class MessageDeleteFailedException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.MessageDeleteFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ConversationErrorMessage[ConversationErrorCodeEnum.MessageDeleteFailed],
    );
  }
}

export class FeedbackSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.FeedbackSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ConversationErrorMessage[ConversationErrorCodeEnum.FeedbackSaveFailed],
    );
  }
}

export class ConversationUpdateFailedException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.ConversationUpdateFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ConversationErrorMessage[
        ConversationErrorCodeEnum.ConversationUpdateFailed
      ],
    );
  }
}

export class FeedbackNotFoundException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.FeedbackNotFound,
      HttpStatus.NOT_FOUND,
      ConversationErrorMessage[ConversationErrorCodeEnum.FeedbackNotFound],
    );
  }
}

export class MissionNotCompletedException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.MissionNotCompleted,
      HttpStatus.BAD_REQUEST,
      ConversationErrorMessage[ConversationErrorCodeEnum.MissionNotCompleted],
    );
  }
}

export class ConversationGroupNotFoundException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.ConversationGroupNotFound,
      HttpStatus.NOT_FOUND,
      ConversationErrorMessage[
        ConversationErrorCodeEnum.ConversationGroupNotFound
      ],
    );
  }
}

export class ConversationGroupSaveFailedException extends CustomBaseException {
  constructor() {
    super(
      ConversationErrorCodeEnum.ConversationGroupSaveFailed,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ConversationErrorMessage[
        ConversationErrorCodeEnum.ConversationGroupSaveFailed
      ],
    );
  }
}
