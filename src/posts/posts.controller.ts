import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { PostsService } from './posts.service';
import { TwErrorRequestFilter } from 'src/auth/filters/tw-error-request.filter';
import { TwErrorServerFilter } from 'src/auth/filters/tw-error-server.filter';
import {
  dateDayBefore,
  dateThreeDaysBefore,
  dateWeekBefore,
} from 'src/utils/time-count.utils';
import { TwitterCountsResponse } from 'src/auth/models/twitter-count-response.model';

@UseFilters(TwErrorRequestFilter, TwErrorServerFilter)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('count/three-days')
  countThreeDays(
    @Query('query') query: string,
  ): Promise<TwitterCountsResponse> {
    const date = dateThreeDaysBefore();
    return this.postsService.countPosts(query, date);
  }

  @Get('count/one-day')
  countOneDay(@Query('query') query: string): Promise<TwitterCountsResponse> {
    const date = dateDayBefore();
    return this.postsService.countPosts(query, date);
  }

  @Get('count/one-week')
  countOneWeeky(@Query('query') query: string): Promise<TwitterCountsResponse> {
    const date = dateWeekBefore();
    return this.postsService.countPosts(query, date);
  }
}
