import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Country, CountryDocument } from './schemas/country.schema';

@Injectable()
export class CountryRepository {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async findOne(countryFilterQuery: FilterQuery<Country>): Promise<Country> {
    return this.countryModel.findOne(countryFilterQuery);
  }

  async find(countriesFilterQuery: FilterQuery<Country>): Promise<Country[]> {
    return this.countryModel.find(countriesFilterQuery);
  }

  async create(country: Country): Promise<Country> {
    const newCountry = new this.countryModel(country);
    return newCountry.save();
  }

  async findOneAndUpdate(
    countryFilterQuery: FilterQuery<Country>,
    country: Partial<Country>,
  ): Promise<Country> {
    return this.countryModel.findOneAndUpdate(countryFilterQuery, country, {
      new: true,
    });
  }
}
