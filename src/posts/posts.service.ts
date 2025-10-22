import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { TwErrorLimitsException } from 'src/auth/exceptions/tw-error-limits.exception';
import { TwErrorRequestException } from 'src/auth/exceptions/tw-error-request.exception';
import { TwErrorServerException } from 'src/auth/exceptions/tw-error-server.exception';
import { TwitterCountsResponse } from 'src/auth/models/twitter-count-response.model';

@Injectable()
export class PostsService {
  async countPosts(
    query: string,
    date: string,
  ): Promise<TwitterCountsResponse> {
    let res: TwitterCountsResponse;
    try {
      const axiosRes = await axios.post<TwitterCountsResponse>(
        'https://api.x.com/2/tweets/counts/recent',
        {
          params: {
            query,
            ['end_time']: date,
          },
        },
      );
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
}
