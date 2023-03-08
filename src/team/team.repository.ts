import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Team, TeamDocument } from './schemas/team.schema';

@Injectable()
export class TeamRepository {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async findOne(teamFilterQuery: FilterQuery<Team>): Promise<Team> {
    return this.teamModel.findOne(teamFilterQuery);
  }

  async find(
    teamsFilterQuery: FilterQuery<Team>,
    sortOptions = '',
    skip = 0,
    limit = 1000,
  ): Promise<Team[]> {
    return this.teamModel
      .find(teamsFilterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  create(team: Partial<Team>, options): Promise<Team> {
    const newTeam = new this.teamModel(team, options);
    return newTeam.save();
  }

  async updateOne(
    teamFilterQuery: FilterQuery<Team>,
    team,
    options,
  ): Promise<void> {
    await this.teamModel.updateOne(teamFilterQuery, team, options);
  }

  async findOneAndUpdate(
    teamFilterQuery: FilterQuery<Team>,
    team: Partial<Team>,
  ): Promise<Team> {
    return this.teamModel.findOneAndUpdate(teamFilterQuery, team, {
      new: true,
    });
  }
}
