import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Transform } from 'class-transformer';

export type RegionDocument = Region & Document;

@Schema()
@ObjectType()
export class Region {
  @Field()
  @Transform(({ value }) => value.toString())
  readonly _id?: string;

  @Field()
  @Prop({ required: true })
  name: string;
}

export const RegionSchema = SchemaFactory.createForClass(Region);
