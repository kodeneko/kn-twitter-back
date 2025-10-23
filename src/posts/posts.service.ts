import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { TwitterCountsResponse } from 'src/auth/models/twitter-count-response.model';
import { TwitterSearchResponse } from 'src/auth/models/twitter-search-response.model';
import { TwErrorLimitsException } from 'src/common/exceptions/twitter/tw-error-limits.exception';
import { TwErrorRequestException } from 'src/common/exceptions/twitter/tw-error-request.exception';
import { TwErrorServerException } from 'src/common/exceptions/twitter/tw-error-server.exception';

@Injectable()
export class PostsService {
  async postCall(
    url: string,
    opts: Record<string, any>,
  ): Promise<TwitterCountsResponse | TwitterSearchResponse> {
    let res: TwitterCountsResponse | TwitterSearchResponse;
    try {
      const axiosRes = await axios.post<
        TwitterCountsResponse | TwitterSearchResponse
      >(url, opts);
      res = axiosRes.data;
    } catch (err) {
      const axiosErr = err as AxiosError;
      const { status } = axiosErr.response as AxiosResponse;
      if (status === 429) throw new TwErrorLimitsException();
      else if (status >= 500) throw new TwErrorServerException();
      else throw new TwErrorRequestException();
    }
    return res;
  }

  async countPosts(
    query: string,
    date: string,
  ): Promise<TwitterCountsResponse> {
    return (await this.postCall('https://api.x.com/2/tweets/counts/recent', {
      params: {
        query,
        ['end_time']: date,
      },
    })) as TwitterCountsResponse;
  }

  async posts(date: string, user: string): Promise<TwitterSearchResponse> {
    return (await this.postCall(`https://api.x.com/2/users/${user}/tweets`, {
      params: {
        ['end_time']: date,
      },
    })) as TwitterSearchResponse;
  }
}
