import { Injectable, PipeTransform } from '@nestjs/common';
import { JwtAuthService } from 'src/auth/jwt-auth.service';
import { JwtTokenPayload } from 'src/auth/models/jwt-token-payload.model';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserFromTokenPipe implements PipeTransform {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly usersService: UsersService,
  ) {}

  async transform(jwt: string) {
    const jwtPayload: JwtTokenPayload = this.jwtAuthService.checkTokenJWT(jwt);
    const user: UserDocument = await this.usersService.findOne(jwtPayload.sub);
    return user;
  }
}
