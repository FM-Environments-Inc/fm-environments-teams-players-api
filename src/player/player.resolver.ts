import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { GetPlayerArgs } from './dto/args/get-player.args';
import { GetPlayersArgs } from './dto/args/get-players.args';
import { Player } from './schemas/player.schema';
import { PlayerService } from './player.service';
import { MatchesRPCService } from '../team/team.interface';

import { NotFoundException } from '../exceptions/not-found.exception';

@Resolver(() => Player)
export class PlayerResolver implements OnModuleInit {
  private matchesRPCService: MatchesRPCService;

  constructor(
    private readonly playerService: PlayerService,
    @Inject('MATCHES_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.matchesRPCService =
      this.client.getService<MatchesRPCService>('MatchesRPCService');
  }

  @Query(() => Player, { name: 'player', nullable: true })
  async getPlayer(@Args() getPlayerArgs: GetPlayerArgs): Promise<Player> {
    const player = await this.playerService.getPlayer(getPlayerArgs);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const matchesResponse = await this.matchesRPCService
      .getPlayersMatches({
        environment: player.environment,
        playerIds: [String(player._id)],
      })
      .toPromise();
    const { data } = matchesResponse;

    const matchesData = data.find(
      ({ playerId }) => playerId === String(player._id),
    );

    return {
      ...player,
      goals: matchesData.goals,
      assists: matchesData.assists,
      matches: matchesData.matches,
    };
  }

  @Query(() => [Player], { name: 'players' })
  async getPlayers(@Args() getPlayersArgs: GetPlayersArgs): Promise<Player[]> {
    try {
      const players = await this.playerService.getPlayers(getPlayersArgs);
      const matchesResponse = await this.matchesRPCService
        .getPlayersMatches({
          environment: getPlayersArgs.environment,
          playerIds: players.map((team) => String(team._id)),
        })
        .toPromise();
      const { data } = matchesResponse;

      return players.map((player) => {
        const matchesData = data.find(
          ({ playerId }) => playerId === String(player._id),
        );

        return {
          ...player,
          matches: matchesData.matches,
          goals: matchesData.goals,
          assists: matchesData.assists,
        };
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error.message);
    }
  }
}
