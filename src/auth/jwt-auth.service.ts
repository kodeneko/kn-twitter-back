import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/users/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtTokenPayload } from './models/jwt-token-payload.model';

@Injectable()
export class JwtAuthService {
  private readonly tokenSecret: string;
  private readonly tokenEmiter: string;
  private readonly tokenReciever: string;

  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.tokenSecret = configService.get<string>('JWT_SECRET', {
      infer: true,
    }) as string;
    this.tokenEmiter = configService.get<string>('JWT_EMITER', {
      infer: true,
    }) as string;
    this.tokenReciever = configService.get<string>('JWT_RECIEVER', {
      infer: true,
    }) as string;
  }

  createTokenJWT(user: UserDocument): string {
    const payload: JwtTokenPayload = {
      sub: user._id.toString(), // Subject = ID de usuario
      name: user.username, // claim personalizada
      email: user.email, // claim personalizada
      // admin: user.admin, // claim personalizada
      iss: this.tokenEmiter, // token emiter
      aud: this.tokenReciever, // token reciever
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // expira en 1 hora
      nbf: Math.floor(Date.now() / 1000), // válido desde ahora
      iat: Math.floor(Date.now() / 1000), // emitido ahora
      jti: uuidv4(), // identificador único del token
      // department: user.department, // claim privada
      // preferences: user.preferences, // claim privada
    };

    const accesToken: string = this.jwtService.sign(payload, {
      secret: this.tokenSecret,
    });
    return accesToken;
  }

  checkTokenJWT(token: string): JwtTokenPayload {
    let payload: JwtTokenPayload;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.tokenSecret,
      } as JwtVerifyOptions);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return payload;
  }
}
