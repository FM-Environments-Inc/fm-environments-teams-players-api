import { Resolver, Query, Args } from '@nestjs/graphql';

import { GetPlayerArgs } from './dto/args/get-player.args';
import { GetPlayersArgs } from './dto/args/get-players.args';
import { Player } from './schemas/player.schema';
import { PlayerService } from './player.service';

import { NotFoundException } from '../exceptions/not-found.exception';

@Resolver(() => Player)
export class PlayerResolver {
  constructor(private readonly playerService: PlayerService) {}

  @Query(() => Player, { name: 'player', nullable: true })
  async getPlayer(@Args() getPlayerArgs: GetPlayerArgs): Promise<Player> {
    const player = await this.playerService.getPlayer(getPlayerArgs);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  @Query(() => [Player], { name: 'players' })
  getPlayers(@Args() getPlayersArgs: GetPlayersArgs): Promise<Player[]> {
    try {
      return this.playerService.getPlayers(getPlayersArgs);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
