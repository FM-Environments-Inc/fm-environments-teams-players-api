import { Module } from '@nestjs/common';

import { ImportResolver } from './import.resolver';
import { ImportTeamsService } from './import-teams.servive';
import { ImportPlayersService } from './import-players.service';

import { CountryModule } from '../country/country.module';
import { RegionModule } from '../region/region.module';
import { TeamModule } from '../team/team.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [CountryModule, RegionModule, TeamModule, PlayerModule],
  providers: [ImportResolver, ImportTeamsService, ImportPlayersService],
  exports: [],
})
export class ImportModule {}
