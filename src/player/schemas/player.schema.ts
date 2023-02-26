import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';

import { Country } from '../../country/schemas/country.schema';
import { PLAYER_ROLE, PLAYER_POSITION } from '../../common/constants';

export type PlayerDocument = Player & Document;

@ObjectType()
export class PlayerRatings {
  @Field()
  overall: number;

  @Field()
  pace?: number;

  @Field()
  shot?: number;

  @Field()
  pass?: number;

  @Field()
  dribbling?: number;

  @Field()
  defending?: number;

  @Field()
  physics?: number;
}

@ObjectType()
export class ProbabilityBonuses {
  @Field()
  GOAL?: string;

  @Field()
  SAVE?: string;

  @Field()
  BALL_TACLE?: string;

  @Field()
  PASS?: string;

  @Field()
  LONG_PASS?: string;

  @Field()
  HEADING?: string;
}

@Schema()
@ObjectType()
export class Player {
  @Field()
  _id: string;

  @Field()
  @Prop()
  firstName?: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true })
  height: number = 180;

  @Field()
  @Prop({ required: true })
  age: number;

  @Field()
  @Prop()
  evaluation: number = 0;

  @Field()
  @Prop()
  photo?: string;

  @Field()
  @Prop({ required: true })
  active: boolean = true;

  @Field()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Country' }] })
  country: Country;

  @Prop({ required: true })
  environment: string;

  @Prop()
  @Field()
  features: string = '';

  @Prop({ required: true })
  @Field()
  role: PLAYER_ROLE;

  @Prop({ required: true })
  @Field()
  position: PLAYER_POSITION;

  @Field(() => PlayerRatings)
  @Prop(
    raw({
      overall: {
        type: Number,
      },
      pace: {
        type: Number,
      },
      shot: {
        type: Number,
      },
      pass: {
        type: Number,
      },
      dribbling: {
        type: Number,
      },
      defending: {
        type: Number,
      },
      physics: {
        type: Number,
      },
    }),
  )
  ratings: Record<string, number> = {};

  @Prop({ type: mongoose.Schema.Types.Mixed })
  @Field(() => ProbabilityBonuses)
  probabilityBonuses: Record<string, number> = {};

  @Prop()
  @Field()
  deletedAt: Date | null = null;

  @Prop()
  @Field()
  createdAt: Date = new Date();

  @Prop()
  @Field()
  updatedAt: Date = new Date();
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
