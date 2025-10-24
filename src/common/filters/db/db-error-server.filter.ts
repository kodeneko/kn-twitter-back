import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  MongoCompatibilityError,
  MongoError,
  MongoNetworkError,
  MongoNetworkTimeoutError,
  MongoParseError,
  MongoServerError,
  MongoWriteConcernError,
} from 'mongodb';

@Catch(
  MongoError,
  MongoNetworkError,
  MongoServerError,
  MongoWriteConcernError,
  MongoParseError,
  MongoNetworkTimeoutError,
  MongoCompatibilityError,
)
export class DbErrorServerFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(500).json({
      path: req.url,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
