import { TrendingService } from './trending.service';
import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import { UserFromTokenPipe } from 'src/common/pipes/user-from-token.pipe';
import type { UserDocument } from 'src/users/schemas/user.schema';

@UseFilters(DbErrorServerFilter, DbErrorRequestFilter, DbErrorRequestFilter)
@Controller('posts')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @UseGuards(JwtGuard)
  @Get(':place')
  get(
    @Param('place') place: string,
    @Cookie('jwt', UserFromTokenPipe) user: UserDocument,
  ) {
    return this.trendingService.getByPlace(place, user.twitter.token);
  }
}
