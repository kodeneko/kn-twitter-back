import { TrendingService } from './trending.service';
import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';

@UseFilters(DbErrorServerFilter, DbErrorRequestFilter, DbErrorRequestFilter)
@Controller('posts')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @Get(':place')
  get(@Param('place') place: string) {
    return this.trendingService.getByPlace(place);
  }
}
