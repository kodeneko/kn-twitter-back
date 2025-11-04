import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { getDateBeforeISO } from 'src/utils/time-count.utils';
import { DaysRangePipe } from './pipes/days-range.pipe';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { TwErrorRequestFilter } from 'src/common/filters/twitter/tw-error-request.filter';
import { TwErrorServerFilter } from 'src/common/filters/twitter/tw-error-server.filter';
import { UserFromTokenPipe } from 'src/common/pipes/user-from-token.pipe';
import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';
import { TwErrorLimitsFilter } from 'src/common/filters/twitter/tw-limits.filter';
import { TwitterCountsResponse } from 'src/common/models/twitter/twitter-count-response.model';
import { TwitterSearchResponse } from 'src/common/models/twitter/twitter-search-response.model';
import { TwErrorAccessFilter } from 'src/common/filters/twitter/tw-error-access.filter';

@UseFilters(
  TwErrorAccessFilter,
  TwErrorRequestFilter,
  TwErrorServerFilter,
  TwErrorLimitsFilter,
  DbErrorServerFilter,
  DbErrorRequestFilter,
  DbErrorRequestFilter,
)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('count')
  count(
    @Query('query') query: string,
    @Query('days', DaysRangePipe) days: number,
  ): Promise<TwitterCountsResponse> {
    const date = getDateBeforeISO(days, 'days');
    return this.postsService.countPosts(query, date);
  }

  @UseGuards(JwtGuard)
  @Get('list')
  list(
    @Query('days', DaysRangePipe) days: number,
    @Cookie('jwt', UserFromTokenPipe) user: UserDocument,
  ): Promise<TwitterSearchResponse> {
    const date = getDateBeforeISO(days, 'days');
    return this.postsService.posts(date, user.twitter.id);
  }
}
