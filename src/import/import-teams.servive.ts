import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';

import { RegionsRepository } from '../region/region.repository';
import { TeamRepository } from '../team/team.repository';
import { CountryRepository } from '../country/country.repository';
import { Region } from '../region/schemas/region.schema';
import { Country } from '../country/schemas/country.schema';
import { Team } from '../team/schemas/team.schema';

import { ICSVTeamRow } from './config/types.d';
import { FileUpload } from '../common/types';
import {
  TEAM_CSV_HEADERS,
  TEAM_NUMERIC_FIELDS,
  TEAM_BOOLEAN_FIELDS,
} from './config';

@Injectable()
export class ImportTeamsService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly countryRepository: CountryRepository,
    private readonly regionRepository: RegionsRepository,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async parseTeamsCSV(
    file: Promise<FileUpload>,
    environment: string,
  ): Promise<boolean> {
    const { createReadStream } = await file;
    let success = true;

    const importedTeams: Array<ICSVTeamRow> = [];

    await new Promise(async (resolve) => {
      createReadStream()
        .pipe(parse({ delimiter: [';'], from_line: 2 }))
        .on('data', (row) => {
          const newTeam: ICSVTeamRow = this.parseRow(row);
          importedTeams.push(newTeam);
        })
        .on('finish', () => {
          success = true;
          resolve(true);
        })
        .on('close', () => {
          success = true;
          resolve(true);
        })
        .on('error', (error) => {
          throw new Error(error.message);
        });
    });

    // TODO: fix replica set
    //const session = await this.connection.startSession();
    //await session.withTransaction(async () => {
      //await Promise.all([
        //this.createRegions(importedTeams, session),
        //this.createCountries(importedTeams, session),
      //]);
      //await this.createOrUpdateTeams(importedTeams, environment, session);
    //});

    await Promise.all([
      this.createRegions(importedTeams),
      this.createCountries(importedTeams),
    ]);
    await this.createOrUpdateTeams(importedTeams, environment);

    return success;
  }

  // TODO: fix session type
  private async createOrUpdateTeams(
    importedTeams: Array<ICSVTeamRow>,
    environment: string,
    session?: any,
  ) {
    const teamNames = [...new Set(importedTeams.map((team) => team.name))];
    const regionNames = [...new Set(importedTeams.map((team) => team.region))];
    const countryNames = [
      ...new Set(importedTeams.map((team) => team.country)),
    ];

    const regions: Region[] = await this.regionRepository.find({
      name: { $in: regionNames },
      session,
    });

    const countries: Country[] = await this.countryRepository.find({
      name: { $in: countryNames },
      session,
    });

    const teamsFromDB: Team[] = await this.teamRepository.find({
      name: { $in: teamNames },
      environment,
    });

    await Promise.all(
      importedTeams.map(async (team) => {
        const region: Region = regions.find(
          (region) => team.region === region.name,
        );
        const country: Country = countries.find(
          (country) => team.country === country.name,
        );
        const newTeam = {
          ...team,
          region,
          country,
          environment,
        };
        const existingTeam = teamsFromDB.find(
          (teamFromDB) => teamFromDB.name === newTeam.name,
        );
        if (existingTeam) {
          await this.teamRepository.updateOne(
            { _id: existingTeam._id },
            newTeam,
            { session },
          );
        } else {
          await this.teamRepository.create(newTeam, { session });
        }
      }),
    );
  }

  // TODO: fix session type
  private async createRegions(
    importedTeams: Array<ICSVTeamRow>,
    session?: any,
  ): Promise<void> {
    const regionNames = [...new Set(importedTeams.map((team) => team.region))];
    const regionsFromDB = await this.regionRepository.find({
      name: { $in: regionNames },
    });
    const regionsFromDBNames: string[] = regionsFromDB.map(
      (region) => region.name,
    );
    const regionsToCreate: Region[] = regionNames
      .filter((name) => !regionsFromDBNames.includes(name) && name)
      .map((name) => ({ name }));
    await this.regionRepository.insertMany(regionsToCreate, { session });
  }

  // TODO: fix session type
  private async createCountries(
    importedTeams: Array<ICSVTeamRow>,
    session?: any,
  ): Promise<void> {
    const countryNames = [
      ...new Set(importedTeams.map((team) => team.country)),
    ];
    const countriesFromDB = await this.countryRepository.find({
      name: { $in: countryNames },
    });
    const countriesFromDBNames: string[] = countriesFromDB.map(
      (country) => country.name,
    );
    const countriesToCreate: Country[] = countryNames
      .filter((name) => !countriesFromDBNames.includes(name))
      .map((name) => ({ name }));
    await this.countryRepository.insertMany(countriesToCreate, { session });
  }

  private parseRow(row: Array<string>): ICSVTeamRow {
    const team: ICSVTeamRow = {};

    for (let i = 0; i < TEAM_CSV_HEADERS.length; i += 1) {
      const key = TEAM_CSV_HEADERS[i];
      const value = row[i];
      switch (true) {
        case TEAM_NUMERIC_FIELDS.includes(key):
          team[key] = parseFloat(value.replace(',', '.'));
          if (isNaN(team[key])) {
            throw new Error('Cannot parse number');
          }
          break;
        case TEAM_BOOLEAN_FIELDS.includes(key):
          team[key] = value.toLowerCase() === 'true';
          break;
        default:
          team[key] = value;
      }
    }

    return team;
  }
}
