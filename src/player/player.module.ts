import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlayerService } from './player.service';
import { PlayerRepository } from './player.repository';
import { PlayerResolver } from './player.resolver';
import { Player, PlayerSchema } from './schemas/player.schema';
import { CountryModule } from '../country/country.module';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    CountryModule,
    forwardRef(() => TeamModule),
  ],
  providers: [PlayerResolver, PlayerRepository, PlayerService],
  exports: [PlayerRepository],
})
export class PlayerModule {}
