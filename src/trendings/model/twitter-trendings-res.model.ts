import { TwitterError } from 'src/common/models/twitter/twitter-error.model';

type TwitterTrendingsData = {
  trend_name: string;
  tweet_count: number;
};

type TwitterTrendingsRes = {
  data?: TwitterTrendingsData[];
  error?: TwitterError;
};

export type { TwitterTrendingsRes };
