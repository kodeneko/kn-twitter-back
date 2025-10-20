import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type { Request, Response } from 'express';
import Redis from 'ioredis';
import {
  createTicket,
  generateCodeChallenge,
  generateCodeVerifier,
} from 'src/utils/pkce.utils';
import type { AxiosError, AxiosResponse } from 'axios';
import qs from 'qs';
import { UsersService } from 'src/users/users.service';
import { Public } from 'src/common/decorators/public.decorator';

interface TwitterTokenResponse {
  length: string;
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
  refresh_token?: string; // si solicitaste offline.access
}

type TwitterMeResponse = {
  data: {
    id: string;
    name: string;
    username: string;
    // opcionales si pides más campos:
    created_at?: string;
    verified?: boolean;
    profile_image_url?: string;
    description?: string;
    public_metrics?: {
      followers_count: number;
      following_count: number;
      tweet_count: number;
      listed_count: number;
    };
  };
};

const redis = new Redis();

@Controller('auth')
export class AuthController {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly urlAuth: string;
  private readonly urlToken: string;
  private readonly urlCallback: string;
  private readonly urlInfo: string;

  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    this.clientId = configService.get<string>('TWITTER_CLIENT_ID', {
      infer: true,
    }) as string;
    this.clientSecret = configService.get<string>('TWITTER_CLIENT_SECRET', {
      infer: true,
    }) as string;
    this.urlAuth = configService.get<string>('TWITTER_URL_AUTH', {
      infer: true,
    }) as string;
    this.urlToken = configService.get<string>('TWITTER_URL_TOKEN', {
      infer: true,
    }) as string;
    this.urlCallback = configService.get<string>('TWITTER_URL_CALLBACK', {
      infer: true,
    }) as string;
    this.urlInfo = configService.get<string>('TWITTER_URL_INFO', {
      infer: true,
    }) as string;
  }

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

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.urlCallback,
      scope: 'tweet.read users.read offline.access',
      state: ticket,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    const url = new URL(this.urlAuth);
    url.search = params.toString();
    res.redirect(url.toString());
  }

  @Public()
  @Get('callback')
  @Render('log.hbs')
  async callback(@Query() query: Record<string, string>, @Res() res: Response) {
    const { state: ticket, code } = query;
    if (!ticket) throw new BadRequestException('There is no state');

    const codeVerifier = await redis.get(`twitterpkce:${ticket}`);
    if (!codeVerifier)
      throw new BadRequestException('There is no code verifier');

    let userTokens: TwitterTokenResponse | undefined = undefined;
    let userError: string = '';
    let userInfo: TwitterMeResponse | undefined = undefined;
    const basicAuth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');
    try {
      // Tokens
      const data = qs.stringify({
        client_id: this.clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.urlCallback,
        code_verifier: codeVerifier,
      });
      const userTokensResult: AxiosResponse<TwitterTokenResponse> =
        await axios.post(this.urlToken, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
          },
        });
      userTokens = userTokensResult.data;

      // Info
      const userInfoResult: AxiosResponse<TwitterMeResponse> = await axios.get(
        this.urlInfo,
        {
          headers: { Authorization: `Bearer ${userTokens.access_token}` },
        },
      );
      userInfo = userInfoResult.data;

      // Find User
      const user = await this.userService.find({
        ['twitter.id']: userInfo.data.id,
      });
      if (user?.length === 0) {
        // Creamos usuario
        const user = await this.userService.create({
          username: userInfo.data.username,
          twitter: {
            id: userInfo.data.id,
            token: userTokens.access_token,
            refreshToken: userTokens.refresh_token,
          },
        });
        console.log('user cerated:', user);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      userError = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;
    }

    await redis.del(`twitterpkce:${ticket}`);
    // this.userService.find({twitter.})
    return {
      tokenResponse: JSON.stringify(userTokens),
      userInfo: JSON.stringify(userInfo),
      errorResponse: JSON.stringify(userError),
    };
  }
}
