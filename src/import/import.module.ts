import { Module } from '@nestjs/common';

import { ImportResolver } from './import.resolver';
import { ImportTeamsService } from './import-teams.servive';
import { CountryModule } from '../country/country.module';
import { RegionModule } from '../region/region.module';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [CountryModule, RegionModule, TeamModule],
  providers: [ImportResolver, ImportTeamsService],
  exports: [],
})
export class ImportModule {}
