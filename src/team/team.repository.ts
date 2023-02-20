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
    sortOptions: string,
    skip = 0,
    limit = 30,
  ): Promise<Team[]> {
    return this.teamModel
      .find(teamsFilterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
  }

  create(team: Team): Promise<Team> {
    const newTeam = new this.teamModel(team);
    return newTeam.save();
  }

  async updateOne(
    teamFilterQuery: FilterQuery<Team>,
    team: Partial<Team>,
  ): Promise<void> {
    await this.teamModel.updateOne(teamFilterQuery, team);
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
