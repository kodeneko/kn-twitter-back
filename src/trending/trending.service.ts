import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TwitterTrendingsRes } from './model/twitter-trendings-res.model';

@Injectable()
export class TrendingService {
  getByPlace(woeid: string, maxTrends = 20): Promise<TwitterTrendingsRes> {
    const res = axios.get(`https://api.x.com/2/trends/by/woeid/${woeid}`, {
      params: { 'max-trends': maxTrends },
    });
    return res;
  }
}
