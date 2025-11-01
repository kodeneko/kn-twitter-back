import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from './jwt-auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
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
    // Check public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
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
    try {
      this.jwtAuthService.checkTokenJWT(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }
}
