import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

import { RegionModule } from './region/region.module';
import { DB_CONNECTION_STRING } from './config/database';

@Module({
  imports: [
    MongooseModule.forRoot(DB_CONNECTION_STRING),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    RegionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
