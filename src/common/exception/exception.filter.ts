import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { Request, Response } from 'express';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.errorCode.status;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      path: request.url,
    });
  }
}
