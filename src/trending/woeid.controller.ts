import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { WoeidService } from './woeid.service';
import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';

@UseFilters(DbErrorServerFilter, DbErrorRequestFilter, DbErrorRequestFilter)
@Controller('woeid')
export class WoeidController {
  constructor(private readonly woeidService: WoeidService) {}

  @Get()
  get(@Query('place') place: string) {
    return this.woeidService.find(place);
  }
}
