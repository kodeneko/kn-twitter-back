import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { TwErrorAccessException } from 'src/common/exceptions/twitter/tw-error-access.exception';
import { TwErrorLimitsException } from 'src/common/exceptions/twitter/tw-error-limits.exception';
import { TwErrorRequestException } from 'src/common/exceptions/twitter/tw-error-request.exception';
import { TwErrorServerException } from 'src/common/exceptions/twitter/tw-error-server.exception';
import { TwitterUserResponse } from './model/twitter-user-response';

@Injectable()
export class UsersTwitterService {
  private bearerToken: string;

  constructor(private readonly configService: ConfigService) {
    this.bearerToken = this.configService.get<string>(
      'TWITTER_BEARER_TOKEN',
    ) as string;
  }

  async get(idTwitter: string): Promise<TwitterUserResponse> {
    let res: TwitterUserResponse;
    const url: string = `https://api.x.com/2/users/${idTwitter}`;
    const fields = [
      'confirmed_email',
      'connection_status',
      'created_at',
      'description',
      'entities',
      'id',
      'is_identity_verified',
      'location',
      'name',
      'parody',
      'profile_banner_url',
      'profile_image_url',
      'protected',
      'url',
      'username',
      'verified',
      'verified_followers_count',
      'verified_type',
    ];
    const opts = {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      },
      params: {
        fields,
      },
    };
    try {
      const axiosRes = await axios.get<TwitterUserResponse>(url, opts);
      res = axiosRes.data;
    } catch (err) {
      const axiosErr = err as AxiosError;
      const { status } = axiosErr.response as AxiosResponse;
      if (status === 403) throw new TwErrorAccessException();
      else if (status === 429) throw new TwErrorLimitsException();
      else if (status >= 500) throw new TwErrorServerException();
      else throw new TwErrorRequestException(status + '');
    }
    return res;
  }
}
