import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwErrorRequestException } from 'src/common/exceptions/twitter/tw-error-request.exception';

@Catch(TwErrorRequestException)
export class TwErrorRequestFilter implements ExceptionFilter {
  catch(exception: TwErrorRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(400).json({
      path: req.url,
      timestamp: new Date().toISOString(),
      message: exception.message,
      details: exception.details,
      stack: exception.stack,
    });
  }
}
