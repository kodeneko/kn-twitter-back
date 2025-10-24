import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwErrorServerException } from 'src/common/exceptions/twitter/tw-error-server.exception';

@Catch(TwErrorServerException)
export class TwErrorServerFilter implements ExceptionFilter {
  catch(exception: TwErrorServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(500).json({
      path: req.url,
      timestamp: new Date().toISOString(),
      nest: 'TwErrorServerFilter',
      message: exception.message,
      details: exception.details,
      stack: exception.stack,
    });
  }
}
