import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DB_CONNECTION_STRING } from './config/database';

@Module({
  imports: [MongooseModule.forRoot(DB_CONNECTION_STRING)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
