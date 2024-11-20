import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { CustomBaseException } from './custom.base.exception';
import { UnexpectedException } from './custom-exception/unexpected.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: Error | CustomBaseException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const res =
      exception instanceof CustomBaseException
        ? exception
        : new UnexpectedException();

    const errorResponse = {
      errorCode: res.errorCode,
      statusCode: res.getStatus(),
      message: res.message,
      timestamp: res.timestamp,
      path: request.url,
    };

    this.logger.error({
      ...errorResponse,
      ...(!(exception instanceof CustomBaseException) && {
        stack: exception.stack,
        originalError: exception,
      }),
    });

    response.status(res.getStatus()).json(errorResponse);
  }
}
