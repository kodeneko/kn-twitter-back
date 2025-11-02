import { TwitterError } from './twitter-error.model';

interface TwitterCountDatum {
  start: string;
  end: string;
  tweet_count: number;
}

interface TwitterCountsMeta {
  newest_id?: string;
  next_token?: string;
  oldest_id?: string;
  total_tweet_count?: number;
}

interface TwitterCountsResponse {
  data?: TwitterCountDatum[];
  meta?: TwitterCountsMeta;
  errors?: TwitterError[];
}

export type { TwitterCountDatum, TwitterCountsMeta, TwitterCountsResponse };
