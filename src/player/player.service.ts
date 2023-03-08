import { Injectable } from '@nestjs/common';

import { Player } from './schemas/player.schema';
import { Team } from '../team/schemas/team.schema';
import { PlayerRepository } from './player.repository';
import { TeamRepository } from '../team/team.repository';
import { GetPlayerArgs } from './dto/args/get-player.args';
import { GetPlayersArgs } from './dto/args/get-players.args';
import { CountryRepository } from '../country/country.repository';
import { getSortPlayersBy } from '../utils';

@Injectable()
export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly countryRepository: CountryRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  getPlayer(getPlayerArgs: GetPlayerArgs): Promise<Player> {
    return this.playerRepository.findOne(getPlayerArgs);
  }

  async getPlayers(getPlayersArgs: GetPlayersArgs): Promise<Player[]> {
    const { page, limit, sortBy, order, country, environment, role } =
      getPlayersArgs;

    let countryObj;
    if (country) {
      const countryObj = await this.countryRepository.findOne({
        name: country,
      });
      if (!countryObj) {
        throw new Error('Country not found');
      }
    }

    const sortPlayersBy: string = getSortPlayersBy(sortBy) as string;
    const sortOrder: number = order && order === 'ASC' ? 1 : -1;
    const skip: number = (page - 1) * limit;
    const sortOptions: string =
      sortOrder === -1 ? `-${sortPlayersBy}` : sortPlayersBy;
    const query: Record<string, any> = { environment };
    if (countryObj) {
      query.country = countryObj;
    }
    if (role) {
      query.role = role;
    }

    let players = await this.playerRepository.find(
      query,
      sortOptions,
      skip,
      limit,
    );
    players = await this.playerRepository.populate(players, [
      {
        path: 'country',
      },
    ]);

    const playerIds: string[] = players.map((player) => player._id);
    const teams: Team[] = await this.teamRepository.find({
      'players.reference': { $in: playerIds },
      isNational: false,
      environment,
    });

    players = players.map((player: Player) => {
      const team = teams.find((team: Team) => {
        const teamPlayerIds = team.players.map((p) => String(p.reference));
        return teamPlayerIds.includes(String(player._id));
      });

      return {
        ...player,
        playerTeam: team,
      };
    });

    return players;
  }
}
