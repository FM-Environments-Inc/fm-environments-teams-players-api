import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';
import { PlayerResolver } from './player.resolver';
import { Player, PlayerSchema } from './schemas/player.schema';
import { CountryModule } from '../country/country.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    CountryModule,
  ],
  providers: [PlayerResolver, PlayerRepository, PlayerService],
})
export class PlayerModule {}
