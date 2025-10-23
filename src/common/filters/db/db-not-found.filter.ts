import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { DbNotFoundException } from 'src/common/exceptions/db/db-not-found.exception';

@Catch(DbNotFoundException)
export class DbErrorRequestFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(404).json({
      path: req.url,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
