import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { WoeidService } from './woeid.service';
import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';

@UseFilters(DbErrorServerFilter, DbErrorRequestFilter, DbErrorRequestFilter)
@Controller('posts')
export class WoeidController {
  constructor(private readonly woeidService: WoeidService) {}

  @Get(':place')
  get(@Param('place') place: string) {
    return this.woeidService.find(place);
  }
}
