import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class TwitterInfo {
  @Prop()
  id: string;

  @Prop()
  token: string;

  @Prop()
  refreshToken: string;

  @Prop()
  expiration: number;
}
const TwitterInfoSchema = SchemaFactory.createForClass(TwitterInfo);

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  // @Prop({ required: true, unique: true })
  @Prop()
  email: string;

  @Prop({ type: TwitterInfoSchema })
  twitter: TwitterInfo;

  @Prop({ required: true, unique: true, default: false })
  admin: boolean;
}

export type UserDocument = User & Document & { _id: Types.ObjectId };

export const UserSchema = SchemaFactory.createForClass(User);
