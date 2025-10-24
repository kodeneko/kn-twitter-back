import { Injectable } from '@nestjs/common';
import { Woeid, WoeidDocument } from './schema/woeid.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DbNotFoundException } from 'src/common/exceptions/db/db-not-found.exception';

@Injectable()
export class WoeidService {
  constructor(
    @InjectModel(Woeid.name) private woeidModel: Model<WoeidDocument>,
  ) {}

  async find(name: string): Promise<WoeidDocument[]> {
    return this.woeidModel
      .find({ place: `/${name}/i` })
      .exec()
      .catch((err: Error) => {
        throw new DbNotFoundException(err.message);
      });
  }
}
