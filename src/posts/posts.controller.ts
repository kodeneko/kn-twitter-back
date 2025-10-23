import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { getDateBeforeISO } from 'src/utils/time-count.utils';
import { TwitterCountsResponse } from 'src/auth/models/twitter-count-response.model';
import { TwitterSearchResponse } from 'src/auth/models/twitter-search-response.model';
import { DaysRangePipe } from './pipes/days-range.pipe';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import { JwtAuthService } from 'src/auth/jwt-auth.service';
import { JwtTokenPayload } from 'src/auth/models/jwt-token-payload.model';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { TwErrorRequestFilter } from 'src/common/filters/twitter/tw-error-request.filter';
import { TwErrorServerFilter } from 'src/common/filters/twitter/tw-error-server.filter';

@UseFilters(TwErrorRequestFilter, TwErrorServerFilter)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('count')
  countThreeDays(
    @Query('query') query: string,
    @Query('days', DaysRangePipe) days: number,
  ): Promise<TwitterCountsResponse> {
    const date = getDateBeforeISO(days, 'days');
    return this.postsService.countPosts(query, date);
  }

  @UseGuards(JwtGuard)
  @Get('posts')
  async postsOneDay(
    @Query('days', DaysRangePipe) days: number,
    @Cookie('jwt') jwt: string,
  ): Promise<TwitterSearchResponse> {
    const jwtPayload: JwtTokenPayload = this.jwtAuthService.checkTokenJWT(jwt);
    const user: UserDocument = await this.usersService.findOne(jwtPayload.sub);
    const date = getDateBeforeISO(days, 'days');
    return this.postsService.posts(date, user.twitter.id);
  }
}
