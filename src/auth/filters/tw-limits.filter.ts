import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwErrorLimitsException } from '../exceptions/tw-error-limits.exception';

@Catch(TwErrorLimitsException)
export class TwErrorServerFilter implements ExceptionFilter {
  catch(exception: TwErrorLimitsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(500).json({
      path: req.url,
      timestamp: new Date().toISOString(),
      message: exception.message,
      details: exception.details,
      stack: exception.stack,
    });
  }
}
