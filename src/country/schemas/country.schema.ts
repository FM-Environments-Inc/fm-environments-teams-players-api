import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { Document } from 'mongoose';

import { Region } from '../../region/schemas/region.schema';

export type CountryDocument = Country & Document;

@Schema()
@ObjectType()
export class Country {
  @Field()
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Region' }] })
  region: Region;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
