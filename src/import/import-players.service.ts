import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';

import { TeamRepository } from '../team/team.repository';
import { CountryRepository } from '../country/country.repository';
import { PlayerRepository } from '../player/player.repository';
import { Player } from '../player/schemas/player.schema';
import { Country } from '../country/schemas/country.schema';
import { Team } from '../team/schemas/team.schema';

import { ICSVPlayerRow } from './config/types.d';
import { FileUpload } from '../common/types';
import {
  PLAYER_NUMERIC_FIELDS,
  PLAYER_CSV_HEADERS,
  PLAYER_RATINGS_FIELDS,
} from './config';
import { FOOT } from '../common/constants';

@Injectable()
export class ImportPlayersService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly countryRepository: CountryRepository,
    private readonly playerRepository: PlayerRepository,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async parseCSV(
    file: Promise<FileUpload>,
    environment: string,
  ): Promise<boolean> {
    const { createReadStream } = await file;
    let success = true;

    const importedPlayers: Array<Partial<ICSVPlayerRow>> = [];

    await new Promise(async (resolve) => {
      createReadStream()
        .pipe(parse({ delimiter: [';'], from_line: 2 }))
        .on('data', (row) => {
          const newPlayer: Partial<ICSVPlayerRow> = this.parseRow(row);
          if (newPlayer.lastName !== '') {
            importedPlayers.push(newPlayer);
          }
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

    // TODO: withTransaction
    await this.createCountries(importedPlayers);
    await this.createOrUpdatePlayers(importedPlayers, environment);

    return success;
  }

  // TODO: fix session type
  private async createOrUpdatePlayers(
    importedPlayers: Array<Partial<ICSVPlayerRow>>,
    environment: string,
    session?: any,
  ) {
    const countryNames = [
      ...new Set(importedPlayers.map((player) => player.country)),
    ];

    const countries: Country[] = await this.countryRepository.find({
      name: { $in: countryNames },
      session,
    });

    const teamNames = [
      ...new Set(importedPlayers.map((player) => player.team)),
    ];

    const teamsFromDB: Team[] = await this.teamRepository.find({
      name: { $in: teamNames },
      environment,
    });

    await Promise.all(
      importedPlayers.map(async (player) => {
        const playerFromDB: Player = await this.playerRepository.findOne({
          firstName: player.firstName,
          lastName: player.lastName,
          environment,
        });

        const country: Country = countries.find(
          (country) => country.name === player.country,
        );

        const team: Team = teamsFromDB.find((t) => t.name === player.team);

        const newPlayer = {
          ...player,
          _id: String(new mongoose.Types.ObjectId()),
          country,
          environment,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          foot: player.foot === 'Right' ? FOOT.RIGHT : FOOT.LEFT,
          height: player.height || 180,
        };
        if (!newPlayer.teamPosition) {
          newPlayer.teamPosition = newPlayer.position;
        }

        if (playerFromDB) {
          return this.playerRepository.updateOne(
            { _id: playerFromDB },
            { ...newPlayer, _id: undefined },
            { session },
          );
        } else {
          await this.playerRepository.create(newPlayer, { session });
          if (team) {
            return this.teamRepository.updateOne(
              { _id: team._id },
              {
                $push: {
                  players: {
                    reference: newPlayer._id,
                    position: newPlayer.teamPosition,
                    createdAt: new Date(),
                  },
                },
              },
              { session },
            );
          }
        }
      }),
    );
  }

  // TODO: fix session type
  private async createCountries(
    importedPlayers: Array<Partial<ICSVPlayerRow>>,
    session?: any,
  ): Promise<void> {
    const countryNames = [
      ...new Set(importedPlayers.map((team) => team.country)),
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

  private parseRow(row: Array<string>): Partial<ICSVPlayerRow> {
    const player: Partial<ICSVPlayerRow> = {};

    for (let i = 0; i < PLAYER_CSV_HEADERS.length; i += 1) {
      const key = PLAYER_CSV_HEADERS[i];
      const value = row[i];
      switch (true) {
        case PLAYER_NUMERIC_FIELDS.includes(key) && value !== '':
          player[key] = parseFloat(value.replace(',', '.'));
          if (isNaN(player[key])) {
            throw new Error('Cannot parse number');
          }
          if (PLAYER_RATINGS_FIELDS.includes(key)) {
            if (!player.ratings) {
              player.ratings = {};
            }
            player.ratings[key] = value;
          }
          break;
        case PLAYER_RATINGS_FIELDS.includes(key):
          if (!player.ratings) {
            player.ratings = {};
          }
          player.ratings[key] = value;
          break;
        default:
          player[key] = value;
      }
    }

    return player;
  }
}
