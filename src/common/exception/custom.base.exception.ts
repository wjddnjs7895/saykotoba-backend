import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface ICustomException {
  errorCode: string;
  timestamp: string;
  statusCode: number;
  path: string;
}

export class CustomBaseException
  extends HttpException
  implements ICustomException
{
  constructor(errorCode: string, statusCode: number, message?: string) {
    super(errorCode, statusCode);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.message = message;
  }

  @ApiProperty()
  errorCode: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;
}
