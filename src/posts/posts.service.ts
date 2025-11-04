import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { TwErrorAccessException } from 'src/common/exceptions/twitter/tw-error-access.exception';
import { TwErrorLimitsException } from 'src/common/exceptions/twitter/tw-error-limits.exception';
import { TwErrorRequestException } from 'src/common/exceptions/twitter/tw-error-request.exception';
import { TwErrorServerException } from 'src/common/exceptions/twitter/tw-error-server.exception';
import { TwitterCountsResponse } from './models/twitter-count-response.model';
import { TwitterSearchResponse } from './models/twitter-search-response.model';

@Injectable()
export class PostsService {
  private bearerToken: string;

  constructor(private readonly configService: ConfigService) {
    this.bearerToken = this.configService.get<string>(
      'TWITTER_BEARER_TOKEN',
    ) as string;
  }

  async postCall(
    url: string,
    opts: Record<string, any>,
  ): Promise<TwitterCountsResponse | TwitterSearchResponse> {
    let res: TwitterCountsResponse | TwitterSearchResponse;
    try {
      const axiosRes = await axios.get<
        TwitterCountsResponse | TwitterSearchResponse
      >(url, opts);
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

  countPosts(
    query: string,
    date: string,
    granurality = 24,
  ): Promise<TwitterCountsResponse> {
    return this.postCall('https://api.x.com/2/tweets/counts/recent', {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      },
      params: {
        query,
        end_time: date,
        granurality,
      },
    }) as Promise<TwitterCountsResponse>;
  }

  posts(date: string, user: string): Promise<TwitterSearchResponse> {
    return this.postCall(`https://api.x.com/2/users/${user}/tweets`, {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      },
      params: {
        end_time: date,
      },
    }) as Promise<TwitterSearchResponse>;
  }
}
