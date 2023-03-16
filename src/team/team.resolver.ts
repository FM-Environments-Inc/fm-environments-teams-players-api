import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { GetTeamArgs } from './dto/args/get-team.args';
import { GetTeamsArgs } from './dto/args/get-teams.args';
import { Team } from './schemas/team.schema';
import { TeamService } from './team.service';
import { MatchesRPCService } from './team.interface';

import { NotFoundException } from '../exceptions/not-found.exception';

@Resolver(() => Team)
export class TeamResolver implements OnModuleInit {
  private matchesRPCService: MatchesRPCService;

  constructor(
    private readonly teamService: TeamService,
    @Inject('MATCHES_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.matchesRPCService =
      this.client.getService<MatchesRPCService>('MatchesRPCService');
  }

  @Query(() => Team, { name: 'team', nullable: true })
  async getTeam(@Args() getTeamArgs: GetTeamArgs): Promise<Team> {
    const team = await this.teamService.getTeam(getTeamArgs);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  @Query(() => [Team], { name: 'teams' })
  async getTeams(@Args() getTeamsArgs: GetTeamsArgs): Promise<Team[]> {
    try {
      const teams = await this.teamService.getTeams(getTeamsArgs);
      const matchesResponse = await this.matchesRPCService
        .getTeamsMatches({
          environment: getTeamsArgs.environment,
          teamIds: teams.map((team) => String(team._id)),
        })
        .toPromise();
      const { data } = matchesResponse;
      return teams.map((team) => {
        const matchesData = data.find(
          ({ teamId }) => teamId === String(team._id),
        );
        return {
          ...team,
          wins: matchesData.wins,
          draws: matchesData.draws,
          loses: matchesData.loses,
          goals: matchesData.goals,
          goalsAgainst: matchesData.goalsAgainst,
          goalsDifference: matchesData.goalsDifference,
        };
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
