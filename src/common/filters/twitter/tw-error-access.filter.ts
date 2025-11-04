import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwErrorAccessException } from 'src/common/exceptions/twitter/tw-error-access.exception';

@Catch(TwErrorAccessException)
export class TwErrorAccessFilter implements ExceptionFilter {
  catch(exception: TwErrorAccessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(403).json({
      code: 403,
      path: req.url,
      timestamp: new Date().toISOString(),
      nest: 'TwErrorAccessFilter',
      message: exception.message,
      details: exception.details,
      stack: exception.stack,
    });
  }
}
