import { TrendingsService } from './trendings.service';
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
@Controller('trendings')
export class TrendingsController {
  constructor(private readonly trendingsService: TrendingsService) {}

  @UseGuards(JwtGuard)
  @Get(':woeid')
  get(@Param('woeid') woeid: string) {
    return this.trendingsService.getByPlace(woeid);
  }
}
