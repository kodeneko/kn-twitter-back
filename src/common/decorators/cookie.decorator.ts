import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

/**
 * Decorador para obtener cookies de la request (req.cookies)
 * Uso: @Cookie('jwt') jwt: string
 */

const { MODE } = process.env;

export const Cookie = createParamDecorator(
  (name: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<
      Request & {
        cookies?: Record<string, string>;
        signedCookies?: Record<string, string>;
      }
    >();
    const cookies = MODE === 'prod' ? req.signedCookies : req.cookies;
    const typed = cookies as Record<string, string>;
    return typed[name as string];
  },
);
