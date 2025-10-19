import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
    const { _id, ...rest } = updateUserDto;
    return this.userModel.findByIdAndUpdate(_id, rest, { new: true }).exec();
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
