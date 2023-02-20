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
      .limit(limit);
  }

  create(player: Player): Promise<Player> {
    const newPlayer = new this.playerModel(player);
    return newPlayer.save();
  }

  async updateOne(
    playerFilterQuery: FilterQuery<Player>,
    player: Partial<Player>,
  ): Promise<void> {
    await this.playerModel.updateOne(playerFilterQuery, player);
  }

  async findOneAndUpdate(
    playerFilterQuery: FilterQuery<Player>,
    player: Partial<Player>,
  ): Promise<Player> {
    return this.playerModel.findOneAndUpdate(playerFilterQuery, player, {
      new: true,
    });
  }
}
