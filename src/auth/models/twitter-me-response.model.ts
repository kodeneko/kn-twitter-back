import { TwitterError } from 'src/common/models/twitter/twitter-error.model';

type TwitterMeResponseData = {
  id: string;
  name: string;
  username: string;
  created_at?: string;
  verified?: boolean;
  profile_image_url?: string;
  description?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
};

type TwitterMeResponse = {
  data?: TwitterMeResponseData;
  errors?: TwitterError[];
};

export type { TwitterMeResponseData, TwitterMeResponse };
