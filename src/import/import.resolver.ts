import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ImportTeamsService } from './import-teams.servive';
import { ImportTeamsInput } from './dto/input/import-teams.input';
import { ImportPlayersService } from './import-players.service';
import { ImportPlayersInput } from './dto/input/import-players.input';

@Resolver('Import')
export class ImportResolver {
  constructor(
    private readonly importTeamsService: ImportTeamsService,
    private readonly importPlayersService: ImportPlayersService,
  ) {}

  // TODO: fix gateway
  @Mutation(() => Boolean)
  async importTeams(
    @Args('importTeamsData') importTeamsData: ImportTeamsInput,
  ): Promise<boolean> {
    try {
      const { file, environment } = importTeamsData;
      const { file: _file } = await file;
      const success = await this.importTeamsService.parseCSV(
        _file,
        environment,
      );
      return success;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // TODO: fix gateway
  @Mutation(() => Boolean)
  async importPlayers(
    @Args('importPlayersData') importPlayersData: ImportPlayersInput,
  ): Promise<boolean> {
    try {
      const { file, environment } = importPlayersData;
      const { file: _file } = await file;
      const success = await this.importPlayersService.parseCSV(
        _file,
        environment,
      );
      return success;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
