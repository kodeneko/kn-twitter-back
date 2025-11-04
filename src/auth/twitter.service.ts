import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import qs from 'qs';
import { ConfigService } from '@nestjs/config';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { UserDocument } from 'src/users/schemas/user.schema';
import { TwErrorServerException } from 'src/common/exceptions/twitter/tw-error-server.exception';
import { TwErrorRequestException } from 'src/common/exceptions/twitter/tw-error-request.exception';
import { TwitterTokenResponse } from 'src/common/models/twitter/twitter-token-response.model';
import {
  TwitterMeResponse,
  TwitterMeResponseData,
} from 'src/common/models/twitter/twitter-me-response.model';

@Injectable()
export class TwitterService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly urlAuth: string;
  private readonly urlToken: string;
  private readonly urlCallback: string;
  private readonly urlInfo: string;

  constructor(
    private readonly userService: UsersService,
    private configService: ConfigService,
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

  createUrlLogin(state: string, codeChallenge: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.urlCallback,
      scope: 'tweet.read users.read offline.access',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    const url = new URL(this.urlAuth);
    url.search = params.toString();
    return url.toString();
  }

  async extractTokens(
    code: string,
    codeVerifier: string,
  ): Promise<{ accesToken: string; refreshToken: string }> {
    const basicAuth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    const data = qs.stringify({
      client_id: this.clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.urlCallback,
      code_verifier: codeVerifier,
    });
    let userTokensResult: AxiosResponse<TwitterTokenResponse>;
    let accesToken: string;
    let refreshToken: string;
    try {
      userTokensResult = await axios.post(this.urlToken, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
      });
      accesToken = userTokensResult.data.access_token;
      refreshToken = userTokensResult.data.refresh_token as string;
    } catch (err) {
      const axiosErr = err as AxiosError;
      throw !axiosErr.response || axiosErr.response.status > 500
        ? new TwErrorServerException()
        : new TwErrorRequestException();
    }
    return { accesToken, refreshToken };
  }

  async getOrCreateUser(
    accesToken: string,
    refreshToken: string,
  ): Promise<UserDocument> {
    let userInfo: TwitterMeResponseData | undefined = undefined;
    try {
      const userInfoResult: AxiosResponse<TwitterMeResponse> = await axios.get(
        this.urlInfo,
        { headers: { Authorization: `Bearer ${accesToken}` } },
      );
      userInfo = userInfoResult.data.data as TwitterMeResponseData;
    } catch (err) {
      const axiosErr = err as AxiosError;
      throw !axiosErr.response || axiosErr.response.status > 500
        ? new TwErrorServerException()
        : new TwErrorRequestException();
    }
    let user: UserDocument;
    const resFindUser = await this.userService.findComplete({
      ['twitter.id']: userInfo.id,
    });

    if (resFindUser?.length === 0) {
      user = await this.userService.create({
        username: userInfo.username,
        twitter: {
          id: userInfo.id,
          token: accesToken,
          refreshToken: refreshToken,
        },
      });
    } else user = resFindUser?.pop() as UserDocument;

    return user;
  }
}
