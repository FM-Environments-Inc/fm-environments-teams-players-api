import { Injectable } from '@nestjs/common';

import { Team } from './schemas/team.schema';
import { TeamRepository } from './team.repository';
import { GetTeamArgs } from './dto/args/get-team.args';
import { GetTeamsArgs } from './dto/args/get-teams.args';
import { CountryRepository } from '../country/country.repository';
import { RegionsRepository } from '../region/region.repository';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly countryRepository: CountryRepository,
    private readonly regionRepository: RegionsRepository,
  ) {}

  getTeam(getTeamArgs: GetTeamArgs): Promise<Team> {
    return this.teamRepository.findOne(getTeamArgs);
  }

  async getTeams(getTeamsArgs: GetTeamsArgs): Promise<Team[]> {
    const {
      page,
      limit,
      sortBy,
      order,
      country,
      environment,
      region,
      isNational,
    } = getTeamsArgs;

    let countryObj;
    if (country) {
      const countryObj = await this.countryRepository.findOne({
        name: country,
      });
      if (!countryObj) {
        throw new Error('Country not found');
      }
    }

    let regionObj;
    if (region) {
      const regionObj = await this.regionRepository.findOne({
        name: region,
      });
      if (!regionObj) {
        throw new Error('Region not found');
      }
    }

    const sortOrder: number = order && order === 'ASC' ? 1 : -1;
    const skip: number = (page - 1) * limit;
    const sortOptions: string = sortOrder === -1 ? `-${sortBy}` : sortBy;
    const query = { environment, countryObj, regionObj, isNational };

    let teams = await this.teamRepository.find(query, sortOptions, skip, limit);
    teams = await this.teamRepository.populate(teams, [{ path: 'country' }]);

    return teams;
  }
}
