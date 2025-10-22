import { Injectable, PipeTransform } from '@nestjs/common';
import { DayRangeException } from '../exceptions/day-range.exception';

@Injectable()
export class DaysRangePipe implements PipeTransform {
  transform(value: string) {
    if (Number(value) < 1 || Number(value) > 7) throw new DayRangeException();
    return value;
  }
}
