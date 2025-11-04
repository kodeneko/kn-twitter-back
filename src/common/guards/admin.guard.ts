import { ConfigService } from '@nestjs/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtAuthService } from 'src/auth/jwt-auth.service';
import { JwtTokenPayload } from 'src/auth/models/jwt-token-payload.model';

@Injectable()
export class AdminGuard implements CanActivate {
  private mode;

  constructor(
    private readonly configService: ConfigService,
    private jwtAuthService: JwtAuthService,
    private reflector: Reflector,
  ) {
    this.mode = this.configService.get<string>('MODE') as string;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    // Get Cookies
    const req = context.switchToHttp().getRequest<
      Request & {
        cookies?: Record<string, string>;
        signedCookies?: Record<string, string>;
      }
    >();
    const cookies = this.mode === 'prod' ? req.signedCookies : req.cookies;

    if (!cookies || Object.keys(cookies).length === 0) {
      throw new UnauthorizedException('No hay cookies en la petición');
    }

    // Get Token
    const token = cookies['jwt'];
    if (!token) throw new UnauthorizedException('Falta el token');

    // Check token
    let payload: JwtTokenPayload;
    try {
      payload = this.jwtAuthService.checkTokenJWT(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // Check is admin
    if (!payload.admin) throw new UnauthorizedException('No admin user');

    return true;
  }
}
