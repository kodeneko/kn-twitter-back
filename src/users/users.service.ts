import { Injectable, UseFilters } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbErrorServerFilter } from 'src/common/filters/db/db-error-server.filter';
import { DbErrorRequestFilter } from 'src/common/filters/db/db-error-request.filter';
import { DbNotFound } from 'src/common/exceptions/db/db-not-found.exception';

@UseFilters(DbErrorServerFilter, DbErrorRequestFilter)
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDTO: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(createUserDTO);
    const savedUser = await user.save();
    return savedUser;
  }

  async findAll({
    skip = 0,
    limit = 10,
  }: {
    skip?: number;
    limit?: number;
  }): Promise<UserDocument[]> {
    return this.userModel.find().skip(skip).limit(limit).exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .exec()
      .then((doc) => {
        if (doc === null) throw new DbNotFound();
        return doc;
      });
  }

  async find(opts: Record<string, string>): Promise<UserDocument[]> {
    return this.userModel
      .find(opts)
      .exec()
      .then((list) => {
        if (list.length === 0) throw new DbNotFound();
        return list;
      });
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const { _id, ...rest } = updateUserDto;
    return this.userModel
      .findByIdAndUpdate(_id, rest, { new: true })
      .exec()
      .then((doc) => {
        if (doc === null) throw new DbNotFound();
        return doc;
      });
  }

  async delete(id: string): Promise<UserDocument> {
    return this.userModel
      .findByIdAndDelete(id)
      .exec()
      .then((doc) => {
        if (doc === null) throw new DbNotFound();
        return doc;
      });
  }
}
