import { ObjectType, Field } from '@nestjs/graphql';
export type SortOrder = 'ASC' | 'DESC';
export type SortBy<T> = keyof T;

export type Response<T> = {
  success: boolean;
  message: string;
  data?: T | unknown;
};

@ObjectType()
export class ResponseQL {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

export type PlayerRatings = {
  overall: number;
  pace?: number;
  shot?: number;
  pass?: number;
  dribbling?: number;
  defending?: number;
  physics?: number;
};
