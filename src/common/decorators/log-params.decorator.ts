import { CustomLoggerService } from '../logger/logger.service';

export const LOG_PARAMS_KEY = 'log_params';

const getLoggerService = (): CustomLoggerService => {
  return global.logger;
};

export function LogParams(): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const logger = new CustomLoggerService(global.s3LoggerService);

    Reflect.defineMetadata(
      LOG_PARAMS_KEY,
      true,
      target.constructor,
      propertyKey as string,
    );

    descriptor.value = async function (...args: any[]) {
      try {
        const logger = getLoggerService();
        const maskedArgs = args.map((arg) => maskSensitiveData(arg));

        logger.debug(
          `[${className}.${String(propertyKey)}] Parameters: ${JSON.stringify(maskedArgs, null, 2)}`,
          'Parameters',
        );

        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        logger.error(
          `Error in ${className}.${String(propertyKey)}: ${error.message}`,
          error.stack,
          `${className}/${String(propertyKey)}`,
        );
        throw error;
      }
    };

    return descriptor;
  };
}

function maskSensitiveData(obj: any): any {
  const sensitiveFields = [
    'password',
    'token',
    'refreshToken',
    'accessToken',
    'authorization',
    'credit_card',
    'cardNumber',
    'cvv',
    'email',
    'phone',
  ];

  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const masked = { ...obj };
  for (const key in masked) {
    if (
      sensitiveFields.some((field) =>
        key.toLowerCase().includes(field.toLowerCase()),
      )
    ) {
      masked[key] = '******';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }
  return masked;
}
