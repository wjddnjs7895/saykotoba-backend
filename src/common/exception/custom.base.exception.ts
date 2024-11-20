import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export abstract class CustomBaseException extends HttpException {
  protected constructor(
    errorCode: string,
    statusCode: number,
    message: string,
  ) {
    super(message, statusCode);
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
  }

  @ApiProperty()
  errorCode: string;

  @ApiProperty()
  timestamp: string;
}
