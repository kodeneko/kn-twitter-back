interface Tweet {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

interface Media {
  media_key: string;
  type?: string;
  url?: string;
}

interface Place {
  id: string;
  full_name?: string;
  country?: string;
}

interface Includes {
  users?: User[];
  tweets?: Tweet[];
  media?: Media[];
  places?: Place[];
}

interface Meta {
  newest_id?: string;
  oldest_id?: string;
  result_count?: number;
  next_token?: string;
  previous_token?: string;
}

interface TwitterSearchError {
  value?: string;
  detail?: string;
  title?: string;
  resource_type?: string;
  parameter?: string;
}

interface TwitterSearchResponse {
  data?: Tweet[];
  includes?: Includes;
  meta?: Meta;
  errors?: TwitterSearchError[];
}

export type {
  Tweet,
  User,
  Media,
  Place,
  Includes,
  Meta,
  TwitterSearchError,
  TwitterSearchResponse,
};
