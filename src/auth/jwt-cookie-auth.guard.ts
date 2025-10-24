import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  private mode: string;
  private cookieSecret: string;

  constructor(private config: ConfigService) {
    this.mode = this.config.get<string>('MODE') as string;
    this.cookieSecret = this.config.get<string>('JWT_SECRET') as string;
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<
      Request & {
        cookies?: Record<string, string>;
        signedCookies?: Record<string, string>;
      }
    >();

    // Check jwt in cookies
    const cookies = this.mode === 'prod' ? req.signedCookies : req.cookies;
    if (!cookies || !cookies.jwt) {
      throw new UnauthorizedException('No token cookie');
    }

    // Check token
    try {
      verify(cookies.jwt as string, this.cookieSecret);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
