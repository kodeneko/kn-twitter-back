import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  MongoBulkWriteError,
  MongoCursorExhaustedError,
  MongoError,
  MongoInvalidArgumentError,
} from 'mongodb';

@Catch(
  MongoBulkWriteError,
  MongoInvalidArgumentError,
  MongoCursorExhaustedError,
)
export class DbErrorRequestFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(400).json({
      path: req.url,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
