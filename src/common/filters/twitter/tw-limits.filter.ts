import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwErrorLimitsException } from 'src/common/exceptions/twitter/tw-error-limits.exception';

@Catch(TwErrorLimitsException)
export class TwErrorLimitsFilter implements ExceptionFilter {
  catch(exception: TwErrorLimitsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(429).json({
      path: req.url,
      timestamp: new Date().toISOString(),
      nest: 'TwErrorServerFilter',
      message: exception.message,
      details: exception.details,
      stack: exception.stack,
    });
  }
}
