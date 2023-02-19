import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Region, RegionDocument } from './schemas/region.schema';

@Injectable()
export class RegionsRepository {
  constructor(
    @InjectModel(Region.name) private regionModel: Model<RegionDocument>,
  ) {}

  async findOne(regionFilterQuery: FilterQuery<Region>): Promise<Region> {
    return this.regionModel.findOne(regionFilterQuery);
  }

  async find(regionsFilterQuery: FilterQuery<Region>): Promise<Region[]> {
    return this.regionModel.find(regionsFilterQuery);
  }

  async create(region: Region): Promise<Region> {
    const newUser = new this.regionModel(region);
    return newUser.save();
  }

  async findOneAndUpdate(
    regionsFilterQuery: FilterQuery<Region>,
    region: Partial<Region>,
  ): Promise<Region> {
    return this.regionModel.findOneAndUpdate(regionsFilterQuery, region, {
      new: true,
    });
  }
}
