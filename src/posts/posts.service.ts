import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { TwErrorLimitsException } from 'src/auth/exceptions/tw-error-limits.exception';
import { TwErrorRequestException } from 'src/auth/exceptions/tw-error-request.exception';
import { TwErrorServerException } from 'src/auth/exceptions/tw-error-server.exception';
import { TwitterCountsResponse } from 'src/auth/models/twitter-count-response.model';
import { TwitterSearchResponse } from 'src/auth/models/twitter-search-response.model';

@Injectable()
export class PostsService {
  async postCall(
    url: string,
    query: string,
    date: string,
  ): Promise<TwitterCountsResponse | TwitterSearchResponse> {
    let res: TwitterCountsResponse | TwitterSearchResponse;
    try {
      const axiosRes = await axios.post<
        TwitterCountsResponse | TwitterSearchResponse
      >(url, {
        params: {
          query,
          ['end_time']: date,
        },
      });
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
    return (await this.postCall(
      'https://api.x.com/2/tweets/counts/recent',
      query,
      date,
    )) as TwitterCountsResponse;
  }

  async posts(query: string, date: string): Promise<TwitterSearchResponse> {
    return (await this.postCall(
      'https://api.x.com/2/tweets/search/recent',
      query,
      date,
    )) as TwitterSearchResponse;
  }
}
