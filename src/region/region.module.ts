import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Region, RegionSchema } from './schemas/region.schema';
import { RegionResolver } from './region.resolver';
import { RegionService } from './region.service';
import { RegionsRepository } from './region.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Region.name, schema: RegionSchema }]),
  ],
  providers: [RegionService, RegionResolver, RegionsRepository],
  exports: [RegionService, RegionsRepository],
})
export class RegionModule {}
