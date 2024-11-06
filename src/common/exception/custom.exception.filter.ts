import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { UnexpectedException } from './custom-exception/unexpected.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: Error | CustomException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const res =
      exception instanceof CustomException
        ? exception
        : new UnexpectedException();

    this.logger.error({
      message: res.message,
      errorCode: res.errorCode,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(!(exception instanceof CustomException) && {
        stack: exception.stack,
        originalError: exception,
      }),
    });

    response.status(res.statusCode).json({
      errorCode: res.errorCode,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
