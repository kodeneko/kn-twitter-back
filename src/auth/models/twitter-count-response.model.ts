interface TwitterCountDatum {
  start: string;
  end: string;
  tweet_count: number;
}

interface TwitterCountsMeta {
  newest_id?: string;
  oldest_id?: string;
  result_count?: number;
  next_token?: string;
}

interface TwitterCountsResponse {
  data?: TwitterCountDatum[];
  meta?: TwitterCountsMeta;
}

export type { TwitterCountDatum, TwitterCountsMeta, TwitterCountsResponse };
