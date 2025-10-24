import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Woeid {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  country: string;
}

export type WoeidDocument = Woeid & Document & { _id: Types.ObjectId };

export const WoeidSchema = SchemaFactory.createForClass(Woeid);
