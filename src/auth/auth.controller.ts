import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
  Render,
  Res,
  UseFilters,
  UseGuards,
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
import { TwitterService } from './twitter.service';
import { JwtAuthService } from './jwt-auth.service';
import { TwErrorRequestFilter } from 'src/common/filters/twitter/tw-error-request.filter';
import { TwErrorServerFilter } from 'src/common/filters/twitter/tw-error-server.filter';
import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import { UserFromTokenPipe } from 'src/common/pipes/user-from-token.pipe';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { JwtGuard } from './jwt.guard';

const redis = new Redis();

@UseFilters(
  TwErrorRequestFilter,
  TwErrorServerFilter,
  DbErrorServerFilter,
  DbErrorRequestFilter,
)
@Controller('auth')
export class AuthController {
  private mode;
  private frontUrl;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly twitterService: TwitterService,
    private readonly jwtAuthService: JwtAuthService,
  ) {
    this.mode = this.configService.get<string>('MODE') as string;
    this.frontUrl = this.configService.get<string>('FRONT_URL') as string;
  }

  @Get('login')
  @Render('login.hbs')
  twitter() {
    return;
  }

  @UseGuards(JwtGuard)
  @Get('islogged')
  isLogged(@Res() res: Response) {
    return res.status(200).json({ msg: 'Está logeado' });
  }

  @Get('twitter')
  async login(
    @Cookie('jwt', UserFromTokenPipe) user: UserDocument,
    @Res() res: Response,
  ) {
    if (user) return res.redirect(`${this.frontUrl}/redirect-twitter`);
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const ticket = createTicket();
    await redis.setex(`twitterpkce:${ticket}`, 600, codeVerifier);

    const url = this.twitterService.createUrlLogin(ticket, codeChallenge);
    return res.redirect(url);
  }

  @Get('callback')
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
    const isProd = this.mode === 'prod';
    const cookieOptions = {
      httpOnly: true,
      secure: !!isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      signed: !!isProd,
    };

    res
      .cookie('jwt', tokenJwt, cookieOptions)
      .redirect(`${this.frontUrl}/redirect-twitter`);
  }

  @Get('logout')
  logout(
    @Cookie('jwt', UserFromTokenPipe) user: UserDocument,
    @Res() res: Response,
  ) {
    if (!user) throw new NotFoundException('There user was not logged');
    res
      .clearCookie('jwt', { path: '/' })
      .status(200)
      .json({ msg: 'Deleted info auth' });
  }
}
