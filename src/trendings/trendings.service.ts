import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { TwitterTrendingsRes } from './model/twitter-trendings-res.model';
import { ConfigService } from '@nestjs/config';
import { TwErrorServerException } from 'src/common/exceptions/twitter/tw-error-server.exception';
import { TwErrorRequestException } from 'src/common/exceptions/twitter/tw-error-request.exception';
import { TwErrorAccessException } from 'src/common/exceptions/twitter/tw-error-access.exception';
import { TwErrorLimitsException } from 'src/common/exceptions/twitter/tw-error-limits.exception';

@Injectable()
export class TrendingsService {
  private bearerToken: string;

  constructor(private readonly configService: ConfigService) {
    this.bearerToken = this.configService.get<string>(
      'TWITTER_BEARER_TOKEN',
    ) as string;
  }

  getByPlace(woeid: string, maxTrends = 20): Promise<TwitterTrendingsRes> {
    return axios
      .get(`https://api.x.com/2/trends/by/woeid/${woeid}`, {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`,
        },
        params: { 'max-trends': maxTrends },
      })
      .catch((err: Error) => {
        const axiosErr = err as AxiosError;
        const { status } = axiosErr.response as AxiosResponse;
        if (status === 403) throw new TwErrorAccessException();
        else if (status === 429) throw new TwErrorLimitsException();
        else if (status >= 500) throw new TwErrorServerException();
        else throw new TwErrorRequestException(status + '');
      });
  }
}
