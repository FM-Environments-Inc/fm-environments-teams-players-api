import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetMatchTeamsArgs {
  @Field(() => [String])
  @IsNotEmpty()
  teamIds: string[];

  @Field()
  @IsNotEmpty()
  environment: string;

  @Field()
  toGetPlayers: boolean = false;
}
