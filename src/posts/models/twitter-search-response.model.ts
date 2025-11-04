import { TwitterError } from 'src/common/models/twitter/twitter-error.model';

interface Tweet {
  id: string;
  text?: string;
  protected?: boolean;
  name?: string;
  created_at?: string;
  username?: string;
}

interface User {
  id: string;
  name?: string;
  username?: string;
  profile_image_url?: string;
}

interface Media {
  height?: number;
  media_key?: string;
  type?: string;
  width?: number;
}

interface Topic {
  description?: string;
  id: string;
  name?: string;
}

interface Poll {
  duration_minutes?: number;
  end_datetime?: string;
  id: string;
  options?: {
    label?: string;
    position?: number;
    votes?: number;
  }[];
  voting_status?: string;
}

interface Place {
  contained_within: string[];
  country?: string;
  country_code?: string;
  full_name?: string;
  geo?: {
    bbox?: number[];
    geometry?: {
      coordinates?: number[];
      type?: string;
    };
    properties?: Record<string, any>;
    type?: string;
  };
  id?: string;
  name?: string;
  place_type?: string;
}

interface Includes {
  media?: Media[];
  places?: Place[];
  polls?: Poll[];
  topics?: Topic[];
  tweets?: Tweet[];
  users?: User[];
}

interface Meta {
  newest_id?: string;
  oldest_id?: string;
  result_count?: number;
  next_token?: string;
  previous_token?: string;
}

interface TwitterSearchResponse {
  data?: Tweet[];
  includes?: Includes;
  meta?: Meta;
  errors?: TwitterError[];
}

export type {
  Tweet,
  User,
  Media,
  Place,
  Includes,
  Meta,
  TwitterSearchResponse,
};
