import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomExceptionFilter } from './common/exception/custom.exception.filter';
import { CustomLoggerService } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { S3LoggerService } from './integrations/aws/services/s3/s3-logger.service';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    bufferLogs: true,
  });

  const s3LoggerService = app.get(S3LoggerService);
  global.s3LoggerService = s3LoggerService;
  const logger = new CustomLoggerService(s3LoggerService);
  global.logger = logger;

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API List')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(8080);

  const server = app.getHttpServer();
  const router = server._events.request._router;

  const routes = router.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path);

  logger.setRegisteredPaths(routes);
  app.useLogger(logger);
}
bootstrap();
