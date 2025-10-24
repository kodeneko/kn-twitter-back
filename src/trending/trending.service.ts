import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TwitterTrendingsRes } from './model/twitter-trendings-res.model';

@Injectable()
export class TrendingService {
  getByPlace(
    woeid: string,
    token: string,
    maxTrends = 20,
  ): Promise<TwitterTrendingsRes> {
    const res = axios.get(`https://api.x.com/2/trends/by/woeid/${woeid}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { 'max-trends': maxTrends },
    });
    return res;
  }
}
