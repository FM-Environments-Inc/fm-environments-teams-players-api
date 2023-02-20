import { Injectable } from '@nestjs/common';

import { Player } from './schemas/player.schema';
import { PlayerRepository } from './player.repository';
import { GetPlayerArgs } from './dto/args/get-player.args';
import { GetPlayersArgs } from './dto/args/get-players.args';
import { CountryRepository } from '../country/country.repository';
import { getSortPlayersBy } from '../utils';

@Injectable()
export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly countryRepository: CountryRepository,
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
    const query = { role, environment, countryObj };

    return this.playerRepository.find(query, sortOptions, skip, limit);
  }
}
