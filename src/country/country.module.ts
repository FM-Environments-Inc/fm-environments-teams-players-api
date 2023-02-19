import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Country, CountrySchema } from './schemas/country.schema';
import { CountryResolver } from './country.resolver';
import { CountryService } from './country.service';
import { CountryRepository } from './country.repository';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    RegionModule,
  ],
  providers: [CountryService, CountryResolver, CountryRepository],
  exports: [CountryService, CountryRepository],
})
export class CountryModule {}
