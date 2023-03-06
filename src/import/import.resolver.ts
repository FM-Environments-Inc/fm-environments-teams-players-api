import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ImportTeamsService } from './import-teams.servive';
import { ImportTeamsInput } from './dto/input/import-teams.input';
import { NotFoundException } from '../exceptions/not-found.exception';

@Resolver('Import')
export class ImportResolver {
  constructor(private readonly importTeamsService: ImportTeamsService) {}

  // TODO: fix gateway
  @Mutation(() => Boolean)
  async importTeams(
    @Args('importTeamsData') importTeamsData: ImportTeamsInput,
  ): Promise<boolean> {
    try {
      const { file, environment } = importTeamsData;
      const { file: _file } = await file;
      const success = await this.importTeamsService.parseTeamsCSV(
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
