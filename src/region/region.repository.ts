import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, InsertManyOptions } from 'mongoose';

import { Region, RegionDocument } from './schemas/region.schema';

@Injectable()
export class RegionsRepository {
  constructor(
    @InjectModel(Region.name) private regionModel: Model<RegionDocument>,
  ) {}

  async findOne(regionFilterQuery: FilterQuery<Region>): Promise<Region> {
    return this.regionModel.findOne(regionFilterQuery);
  }

  // TODO: fix session type
  async find(
    regionsFilterQuery: FilterQuery<Region>,
    session?: any,
  ): Promise<Region[]> {
    return this.regionModel.find(regionsFilterQuery).session(session).lean();
  }

  async create(region: Region): Promise<Region> {
    const newRegion = new this.regionModel(region);
    return newRegion.save();
  }

  async insertMany(
    regions: Region[],
    options: InsertManyOptions = {},
  ): Promise<void> {
    await this.regionModel.insertMany(regions, options);
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
