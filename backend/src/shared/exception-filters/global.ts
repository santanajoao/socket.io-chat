import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { STATUS_CODES } from 'node:http';

@Catch()
export class HttpGlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();

    const isNestException = exception instanceof HttpException;
    if (!isNestException) {
      const statusCode = 500;

      return response.status(statusCode).json({
        error: {
          message: 'Unexpected error',
          status: statusCode,
          statusText: STATUS_CODES[statusCode],
        },
      });
    }

    const statusCode = exception.getStatus();
    return response.status(statusCode).json({
      error: {
        message: exception.message,
        status: statusCode,
        statusText: STATUS_CODES[statusCode],
      },
    });
  }
}
