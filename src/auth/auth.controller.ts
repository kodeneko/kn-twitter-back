import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Render,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import Redis from 'ioredis';
import {
  createTicket,
  generateCodeChallenge,
  generateCodeVerifier,
} from 'src/utils/pkce.utils';
import { UsersService } from 'src/users/users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { TwitterService } from './twitter.service';
import { TwErrorServerFilter } from './filters/tw-error-server.filter';
import { TwErrorRequestFilter } from './filters/tw-error-request.filter';
import { DbErrorServerFilter } from 'src/common/filters/db-error-server.filter';
import { DbErrorRequestFilter } from 'src/common/filters/db-error-request.filter';
import { JwtAuthService } from './jwt-auth.service';

const redis = new Redis();

@UseFilters(
  TwErrorRequestFilter,
  TwErrorServerFilter,
  DbErrorServerFilter,
  DbErrorRequestFilter,
)
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService,
    private readonly twitterService: TwitterService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Public()
  @Get('login')
  @Render('login.hbs')
  twitter() {
    return {};
  }

  @Public()
  @Get('twitter')
  async login(@Req() req: Request, @Res() res: Response) {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const ticket = createTicket();
    await redis.setex(`twitterpkce:${ticket}`, 600, codeVerifier);

    const url = this.twitterService.createUrlLogin(ticket, codeChallenge);
    res.redirect(url);
  }

  @Public()
  @Get('callback')
  @Render('log.hbs')
  async callback(@Query() query: Record<string, string>, @Res() res: Response) {
    // Get tokens
    const { state: ticket, code } = query;
    if (!ticket) throw new BadRequestException('There is no state');

    const codeVerifier = await redis.get(`twitterpkce:${ticket}`);
    if (!codeVerifier)
      throw new BadRequestException('There is no code verifier');

    const { accesToken, refreshToken } =
      await this.twitterService.extractTokens(code, codeVerifier);

    // Get user
    const user = await this.twitterService.getOrCreateUser(
      accesToken,
      refreshToken,
    );
    await redis.del(`twitterpkce:${ticket}`);

    // Create JWT token
    const tokenJwt = this.jwtAuthService.createTokenJWT(user);
    // const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const isProd = false;
    const cookieOptions = {
      httpOnly: true,
      secure: !!isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };

    res.cookie('jwt', tokenJwt, cookieOptions);
    res.redirect('/');
  }
}
