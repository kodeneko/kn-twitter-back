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
import qs from 'qs';

const redis = new Redis();

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

  @Get('login')
  @Render('login.hbs')
  twitter() {
    return {};
  }

  @Get('twitter')
  async login(@Req() req: Request, @Res() res: Response) {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const ticket = createTicket();

    await redis.setex(`twitterpkce:${ticket}`, 600, codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.configService.get<string>('CLIENT_ID') as string,
      redirect_uri: this.configService.get<string>(
        'REDIRECT_CALLBACK',
      ) as string,
      scope: 'tweet.read users.read offline.access',
      state: ticket,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    res.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`);
  }

  @Get('callback')
  @Render('success.hbs')
  async callback(@Query() query: Record<string, string>, @Res() res: Response) {
    const { state: ticket, code } = query;
    if (!ticket) throw new BadRequestException('turururu ticket');

    const codeVerifier = await redis.get(`twitterpkce:${ticket}`);
    if (!codeVerifier) throw new BadRequestException('turururu codeVerifier');

    const clientId = this.configService.get<string>('CLIENT_ID') as string;
    const clientSecret = this.configService.get<string>(
      'CLIENT_SECRET',
    ) as string;
    let response;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const redirectUrl = this.configService.get<string>(
      'REDIRECT_CALLBACK',
    ) as string;
    try {
      const data = qs.stringify({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUrl,
        code_verifier: codeVerifier,
      });
      response = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
          },
        },
      );
    } catch (err) {
      console.log('error-data', err.response?.data);
      response = err.response?.data;
    }

    await redis.del(`twitterpkce:${ticket}`);
    console.log('los tokens', response.data);
    return { response: JSON.stringify(response.message) };
  }
}
