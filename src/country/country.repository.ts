import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, InsertManyOptions } from 'mongoose';

import { Country, CountryDocument } from './schemas/country.schema';

@Injectable()
export class CountryRepository {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async findOne(countryFilterQuery: FilterQuery<Country>): Promise<Country> {
    return this.countryModel.findOne(countryFilterQuery);
  }

  // TODO: fix type
  async find(
    countriesFilterQuery: FilterQuery<Country>,
    session?: any,
  ): Promise<Country[]> {
    return this.countryModel.find(countriesFilterQuery).session(session).lean();
  }

  async create(country: Country): Promise<Country> {
    const newCountry = new this.countryModel(country);
    return newCountry.save();
  }

  async insertMany(
    countries: Country[],
    options: InsertManyOptions = {},
  ): Promise<void> {
    await this.countryModel.insertMany(countries, options);
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
