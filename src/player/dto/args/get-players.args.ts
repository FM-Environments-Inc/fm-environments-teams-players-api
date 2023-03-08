import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { SortOrder } from '../../../common/types';
import { PLAYER_ROLE } from '../../../common/constants';

@ArgsType()
export class GetPlayersArgs {
  @IsNotEmpty()
  @Field()
  environment: string;

  @Field({ nullable: true })
  country?: string;

  @Field()
  sortBy?: string = 'evaluation';

  @Field({ nullable: true })
  role?: PLAYER_ROLE;

  @Field()
  order?: SortOrder = 'DESC';

  @Field()
  page?: number = 1;

  @Field()
  limit?: number = 30;
}
