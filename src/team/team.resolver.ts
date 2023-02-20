import { Resolver, Query, Args } from '@nestjs/graphql';

import { GetTeamArgs } from './dto/args/get-team.args';
import { GetTeamsArgs } from './dto/args/get-teams.args';
import { Team } from './schemas/team.schema';
import { TeamService } from './team.service';

import { NotFoundException } from '../exceptions/not-found.exception';

@Resolver(() => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => Team, { name: 'team', nullable: true })
  async getTeam(@Args() getTeamArgs: GetTeamArgs): Promise<Team> {
    const team = await this.teamService.getTeam(getTeamArgs);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  @Query(() => [Team], { name: 'teams' })
  getTeams(@Args() getTeamsArgs: GetTeamsArgs): Promise<Team[]> {
    try {
      return this.teamService.getTeams(getTeamsArgs);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
