import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';

import { Country } from '../../country/schemas/country.schema';
import { PLAYER_ROLE, PLAYER_POSITION, FOOT } from '../../common/constants';

export type PlayerDocument = Player & Document;

@ObjectType()
export class PlayerTeam {
  @Field()
  name: string;

  @Field()
  logo?: string;
}

@ObjectType()
export class PlayerRatings {
  @Field()
  overall: number;

  @Field({ nullable: true })
  pace?: number;

  @Field({ nullable: true })
  shot?: number;

  @Field({ nullable: true })
  pass?: number;

  @Field({ nullable: true })
  dribbling?: number;

  @Field({ nullable: true })
  defending?: number;

  @Field({ nullable: true })
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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
  country: Country;

  @Prop({ required: true })
  environment: string;

  @Prop()
  @Field()
  features: string = '';

  @Prop({ type: String, default: FOOT.RIGHT, enum: Object.values(FOOT) })
  @Field()
  foot: FOOT = FOOT.RIGHT;

  @Prop()
  @Field({ nullable: true })
  role: PLAYER_ROLE;

  @Prop({ required: true })
  @Field()
  position: PLAYER_POSITION;

  @Field(() => PlayerRatings, { nullable: true })
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
  @Field(() => ProbabilityBonuses, { nullable: true })
  probabilityBonuses: Record<string, number> = {};

  @Prop()
  @Field()
  deletedAt?: Date | null = null;

  @Prop()
  @Field()
  createdAt: Date = new Date();

  @Prop()
  @Field()
  updatedAt: Date = new Date();

  @Field(() => PlayerTeam, { nullable: true })
  playerTeam: PlayerTeam;

  @Field({ nullable: true })
  goals?: number = 0;

  @Field({ nullable: true })
  assists?: number = 0;

  @Field({ nullable: true })
  matches?: number = 0;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
PlayerSchema.index({ evaluation: -1 });
PlayerSchema.index({ firstName: 1, lastName: 1 });
