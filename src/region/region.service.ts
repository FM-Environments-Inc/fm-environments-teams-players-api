import { Injectable } from '@nestjs/common';

import { Region } from './schemas/region.schema';
import { RegionsRepository } from './region.repository';

@Injectable()
export class RegionService {
  constructor(private readonly regionsRepository: RegionsRepository) {}

  async getRegionByName(name: string): Promise<Region> {
    return this.regionsRepository.findOne({ name });
  }

  async getRegions(): Promise<Region[]> {
    return this.regionsRepository.find({});
  }
}
