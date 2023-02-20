import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

import { RegionModule } from './region/region.module';
import { CountryModule } from './country/country.module';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';

import { DB_CONNECTION_STRING } from './config/database';

@Module({
  imports: [
    MongooseModule.forRoot(DB_CONNECTION_STRING),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    RegionModule,
    CountryModule,
    PlayerModule,
    TeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
