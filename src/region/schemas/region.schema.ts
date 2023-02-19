import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { Document } from 'mongoose';

export type RegionDocument = Region & Document;

@Schema()
@ObjectType()
export class Region {
  @Field()
  @Prop({ required: true })
  name: string;
}

export const RegionSchema = SchemaFactory.createForClass(Region);
