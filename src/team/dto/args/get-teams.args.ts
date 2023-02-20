import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { SortOrder } from '../../../common/types';

@ArgsType()
export class GetTeamsArgs {
  @IsNotEmpty()
  @Field()
  environment: string;

  @Field()
  isNational: boolean = false;

  @Field({ nullable: true })
  country?: string | null = null;

  @Field({ nullable: true })
  region?: string | null = null;

  @Field({ nullable: true })
  sortBy?: string = 'evaluation';

  @Field({ nullable: true })
  order?: SortOrder = 'DESC';

  @Field()
  page?: number = 1;

  @Field()
  limit?: number = 30;
}
