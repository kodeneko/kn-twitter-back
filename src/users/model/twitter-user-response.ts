import { TwitterError } from 'src/common/models/twitter/twitter-error.model';
import { TwitterUser } from './twitter.user.model';

interface TwitterUserResponse {
  data: TwitterUser;
  errors: TwitterError[];
}

export type { TwitterUserResponse };
