import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';

import { Country } from '../../country/schemas/country.schema';
import { Region } from '../../region/schemas/region.schema';
import { Player } from '../../player/schemas/player.schema';
import { PLAYER_POSITION } from '../../common/constants';

export type TeamDocument = Team & Document;

@ObjectType()
export class TeamPlayers {
  @Field()
  _id: string;

  @Field()
  position: PLAYER_POSITION;

  @Field()
  reference: Player;

  @Field()
  createdAt: Date = new Date();

  @Field()
  isPenaltyShooter: boolean = false;

  @Field()
  isFreeKicker: boolean = false;

  @Field()
  isCornerKicker: boolean = false;
}

@Schema()
@ObjectType()
export class Team {
  @Field()
  readonly _id?: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop()
  logo?: string;

  @Field()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Country' })
  country: Country;

  @Field({ nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Region' })
  region?: Region;

  @Field()
  @Prop({ required: true })
  environment: string;

  @Field()
  @Prop({ required: true })
  division: number = 1;

  @Field()
  @Prop({ required: true })
  isNational: boolean = false;

  @Field()
  @Prop({ required: true })
  evaluation: number = 0;

  @Field(() => TeamPlayers)
  @Prop(
    raw({
      reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
      position: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
      isPenaltyShooter: {
        type: Boolean,
        default: false,
      },
      isFreeKicker: {
        type: Boolean,
        default: false,
      },
      isCornerKicker: {
        type: Boolean,
        default: false,
      },
    }),
  )
  players?: Record<string, number> = {};

  @Prop()
  @Field()
  createdAt?: Date = new Date();

  @Prop()
  @Field()
  updatedAt?: Date = new Date();

  @Prop()
  @Field()
  deletedAt?: Date | null = null;

  @Prop()
  @Field()
  archivedAt?: Date | null = null;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
