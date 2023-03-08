import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Player, PlayerDocument } from './schemas/player.schema';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async findOne(playerFilterQuery: FilterQuery<Player>): Promise<Player> {
    return this.playerModel.findOne(playerFilterQuery);
  }

  async find(
    playersFilterQuery: FilterQuery<Player>,
    sortOptions: string,
    skip = 0,
    limit = 30,
  ): Promise<Player[]> {
    return this.playerModel
      .find(playersFilterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  create(player: Partial<Player>, options): Promise<Player> {
    const newPlayer = new this.playerModel(player, options);
    return newPlayer.save();
  }

  async updateOne(
    playerFilterQuery: FilterQuery<Player>,
    player: Partial<Player>,
    options,
  ): Promise<void> {
    await this.playerModel.updateOne(playerFilterQuery, player, options);
  }

  async findOneAndUpdate(
    playerFilterQuery: FilterQuery<Player>,
    player: Partial<Player>,
  ): Promise<Player> {
    return this.playerModel.findOneAndUpdate(playerFilterQuery, player, {
      new: true,
    });
  }

  async populate(
    players: Array<Player>,
    populateOptions,
  ): Promise<Array<Player>> {
    return this.playerModel.populate(players, populateOptions);
  }
}
