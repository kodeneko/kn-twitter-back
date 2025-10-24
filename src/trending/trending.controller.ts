import { TrendingService } from './trending.service';
import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TwErrorRequestFilter } from 'src/common/filters/twitter/tw-error-request.filter';
import { TwErrorServerFilter } from 'src/common/filters/twitter/tw-error-server.filter';

@UseFilters(
  TwErrorRequestFilter,
  TwErrorServerFilter,
  DbErrorServerFilter,
  DbErrorRequestFilter,
)
@UseGuards(JwtGuard)
@Controller('trending')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @UseGuards(JwtGuard)
  @Get(':woeid')
  get(@Param('woeid') woeid: string) {
    return this.trendingService.getByPlace(woeid);
  }
}
