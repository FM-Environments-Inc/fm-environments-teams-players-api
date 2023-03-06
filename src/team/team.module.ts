import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { TeamResolver } from './team.resolver';
import { Team, TeamSchema } from './schemas/team.schema';
import { CountryModule } from '../country/country.module';
import { RegionModule } from '../region/region.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    CountryModule,
    RegionModule,
    PlayerModule,
  ],
  providers: [TeamResolver, TeamRepository, TeamService],
  exports: [TeamRepository],
})
export class TeamModule {}
