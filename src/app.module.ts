import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

import { RegionModule } from './region/region.module';
import { CountryModule } from './country/country.module';
import { PlayerModule } from './player/player.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
