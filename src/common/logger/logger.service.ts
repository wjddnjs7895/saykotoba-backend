import { S3LoggerService } from '@/integrations/aws/services/s3/s3-logger.service';
import { LoggerService } from '@nestjs/common';
import * as chalk from 'chalk';

export class CustomLoggerService implements LoggerService {
  private logBuffer: string[] = [];
  private readonly flushInterval = 30 * 60 * 1000;

  constructor(private readonly s3LoggerService: S3LoggerService) {
    setInterval(() => this.flushLogs(), this.flushInterval);
  }

  private async flushLogs() {
    if (this.logBuffer.length === 0) return;

    const timestamp = new Date().toISOString();
    const logContent = this.logBuffer.join('\n');
    const key = `${timestamp.slice(0, 7)}/${timestamp.slice(5, 10)}/batch-${timestamp}.log`;

    await this.s3LoggerService.uploadLog(key, logContent);
    this.logBuffer = [];
  }
  private registeredPaths: Set<string> = new Set();

  setRegisteredPaths(paths: string[]) {
    this.registeredPaths = new Set(paths);
  }

  private shouldLog(context?: string, message?: any): boolean {
    if (!context) {
      return false;
    }

    if (context === 'HTTP' && typeof message === 'string') {
      const matches = message.match(/^(GET|POST|PUT|DELETE|PATCH)\s+([^\s]+)/);
      if (matches) {
        const path = matches[2];
        if (!this.registeredPaths.has(path)) {
          return false;
        }
      }
    }

    if (typeof message === 'object') {
      if (message.path) {
        if (!this.registeredPaths.has(message.path)) {
          return false;
        }
      }
    }

    return true;
  }

  private getColorByLevel(level: string): chalk.ChalkFunction {
    switch (level) {
      case 'LOG':
        return chalk.green;
      case 'ERROR':
        return chalk.red;
      case 'WARN':
        return chalk.yellow;
      case 'DEBUG':
        return chalk.blue;
      case 'VERBOSE':
        return chalk.magenta;
      default:
        return chalk.white;
    }
  }

  private printMessage(
    level: string,
    message: any,
    context?: string,
    stack?: string,
  ) {
    if (!this.shouldLog(context, message)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const color = this.getColorByLevel(level);

    const pidMessage = chalk.yellow(`[Nest] ${process.pid}  - ${timestamp}`);
    const contextMessage = context ? chalk.yellow(`[${context}] `) : '';
    const levelMessage = color(`${level} `);

    if (typeof message === 'object') {
      console.log(`${pidMessage}   ${levelMessage}${contextMessage}`);
      console.log(message);
    } else {
      console.log(`${pidMessage}   ${levelMessage}${contextMessage}${message}`);
    }

    if (stack) {
      console.log(chalk.red(stack));
    }
  }

  log(message: string, context?: string) {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'LOG',
      context,
      message,
    });
    this.logBuffer.push(logEntry);
    this.printMessage('LOG', message, context);
  }

  error(message: any, stack?: string, context?: string) {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      context,
      message,
      stack,
    });
    this.logBuffer.push(logEntry);
    this.printMessage('ERROR', message, context, stack);
  }

  warn(message: any, context?: string) {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      context,
      message,
    });
    this.logBuffer.push(logEntry);
    this.printMessage('WARN', message, context);
  }

  debug(message: any, context?: string) {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      context,
      message,
    });
    this.logBuffer.push(logEntry);
    this.printMessage('DEBUG', message, context);
  }

  verbose(message: any, context?: string) {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'VERBOSE',
      context,
      message,
    });
    this.logBuffer.push(logEntry);
    this.printMessage('VERBOSE', message, context);
  }
}
