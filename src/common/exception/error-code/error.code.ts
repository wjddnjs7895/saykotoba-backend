class ErrorCodeVo {
  readonly status;
  readonly message;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

export const ENTITY_NOT_FOUND = new ErrorCodeVo(404, 'Entity Not Found');
