import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FilterQuery } from 'mongoose';

import { Team } from './schemas/team.schema';
import { TeamRepository } from './team.repository';
import { GetMatchTeamsArgs } from './dto/args/get-match-teams.args';

@Controller()
export class TeamRPCService {
  constructor(private readonly teamRepository: TeamRepository) {}

  @GrpcMethod('TeamRPCService', 'getMatchTeams')
  async getMatchTeams(getTeamsMatchesArgs: GetMatchTeamsArgs) {
    const { teamIds, environment, toGetPlayers = false } = getTeamsMatchesArgs;

    const query: FilterQuery<Team> = {
      _id: { $in: teamIds },
      environment,
    };
    const select = toGetPlayers ? '_id name logo players' : '_id name logo';

    let teams: Team[] = await this.teamRepository.find(query, select);
    if (toGetPlayers) {
      teams = await this.teamRepository.populate(teams, [
        {
          path: 'players.reference',
        },
      ]);
    }

    return {
      data: teams,
    };
  }
}
