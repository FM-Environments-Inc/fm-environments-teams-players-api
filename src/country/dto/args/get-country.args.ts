import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetCountryArgs {
  @Field()
  @IsNotEmpty()
  name: string;
}
