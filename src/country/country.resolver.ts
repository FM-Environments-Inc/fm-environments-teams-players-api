import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { GetCountryArgs } from './dto/args/get-country.args';
import { CreateCountryInput } from './dto/input/create-country.input';
import { Country } from './schemas/country.schema';
import { CountryService } from './country.service';

import { NotFoundException } from '../exceptions/not-found.exception';

@Resolver(() => Country)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Query(() => Country, { name: 'country', nullable: true })
  async getCountry(@Args() getCountryArgs: GetCountryArgs): Promise<Country> {
    const country = await this.countryService.getCountry(getCountryArgs);
    if (!country) {
      throw new NotFoundException('Country not found');
    }
    return country;
  }

  @Query(() => [Country], { name: 'countries' })
  async getCountries(): Promise<Country[]> {
    const countries = await this.countryService.getCountries();
    return countries;
  }

  @Mutation(() => Country)
  async createEnvironment(
    @Args('createCountryData') createCountryData: CreateCountryInput,
  ): Promise<Country> {
    const country = await this.countryService.createCountry(createCountryData);
    if (!country) {
      throw new NotFoundException('Region not found');
    }
    return country;
  }
}
