import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { RegionModule } from './region/region.module';
import { CountryModule } from './country/country.module';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { ImportModule } from './import/import.module';

import { DB_CONNECTION_STRING } from './config/database';

@Module({
  imports: [
    MongooseModule.forRoot(DB_CONNECTION_STRING),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        path: join(process.cwd(), 'src/graphql-schema.gql'),
        federation: 2,
      },
      debug: true,
    }),
    RegionModule,
    CountryModule,
    PlayerModule,
    TeamModule,
    ImportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
