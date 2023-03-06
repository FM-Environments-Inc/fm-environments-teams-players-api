import { Injectable } from '@nestjs/common';

import { Country } from './schemas/country.schema';
import { CountryRepository } from './country.repository';
import { GetCountryArgs } from './dto/args/get-country.args';
import { CreateCountryInput } from './dto/input/create-country.input';
import { RegionsRepository } from '../region/region.repository';

@Injectable()
export class CountryService {
  constructor(
    private readonly countryRepository: CountryRepository,
    private readonly regionsRepository: RegionsRepository,
  ) {}

  getCountry(getCountryArgs: GetCountryArgs): Promise<Country> {
    return this.countryRepository.findOne(getCountryArgs);
  }

  getCountries(): Promise<Country[]> {
    return this.countryRepository.find({});
  }

  async createCountry(countryInput: CreateCountryInput): Promise<Country> {
    return this.countryRepository.create({ ...countryInput });
  }
}
