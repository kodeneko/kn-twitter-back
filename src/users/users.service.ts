import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbNotFoundException } from 'src/common/exceptions/db/db-not-found.exception';
import { userDocuToUserSkipParser } from './utils/user.parse';
import { UserSkipRes } from './model/user-skip-res.model';

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
  }): Promise<UserSkipRes[]> {
    return this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec()
      .then((list) => list.map((e) => userDocuToUserSkipParser(e)));
  }

  async findOne(id: string): Promise<UserSkipRes> {
    return this.userModel
      .findById(id)
      .exec()
      .then((doc) => {
        if (doc === null) throw new DbNotFoundException();
        return userDocuToUserSkipParser(doc);
      });
  }

  async findOneComplete(id: string): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .exec()
      .then((doc) => {
        if (doc === null) throw new DbNotFoundException();
        return doc;
      });
  }

  async find(opts: Record<string, string>): Promise<UserSkipRes[]> {
    return this.userModel
      .find(opts)
      .exec()
      .then((list) => {
        if (list.length === 0) throw new DbNotFoundException();
        return list.map((e) => userDocuToUserSkipParser(e));
      });
  }

  async findComplete(opts: Record<string, string>): Promise<UserDocument[]> {
    return this.userModel
      .find(opts)
      .exec()
      .then((list) => {
        if (list.length === 0) throw new DbNotFoundException();
        return list;
      });
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserSkipRes> {
    const { _id, ...rest } = updateUserDto;
    return this.userModel
      .findByIdAndUpdate(_id, rest, { new: true })
      .exec()
      .then((doc) => {
        if (doc === null) throw new DbNotFoundException();
        return userDocuToUserSkipParser(doc);
      });
  }

  async delete(id: string): Promise<UserSkipRes> {
    return this.userModel
      .findByIdAndDelete(id)
      .exec()
      .then((doc) => {
        if (doc === null) throw new DbNotFoundException();
        return userDocuToUserSkipParser(doc);
      });
  }
}
