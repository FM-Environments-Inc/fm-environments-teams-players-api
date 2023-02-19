import { Resolver, Query, Args } from '@nestjs/graphql';
import { GetRegionArgs } from './dto/args/get-region.args';

import { Region } from './schemas/region.schema';
import { RegionService } from './region.service';

import { NotFoundException } from '../exceptions/not-found.exception';

@Resolver(() => Region)
export class RegionResolver {
  constructor(private readonly regionService: RegionService) {}

  @Query(() => Region, { name: 'region', nullable: true })
  async getRegion(@Args() getRegionArgs: GetRegionArgs): Promise<Region> {
    const region = await this.regionService.getRegionByName(getRegionArgs.name);
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    return region;
  }

  @Query(() => [Region], { name: 'regions' })
  async getRegions(): Promise<Region[]> {
    const regions = await this.regionService.getRegions();
    return regions;
  }
}
