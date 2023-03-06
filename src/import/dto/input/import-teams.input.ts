//import { GraphQLUpload } from 'graphql-upload';
import { GraphQLUpload } from 'graphql-upload-ts';
import { InputType, Field } from '@nestjs/graphql';

import { FileUpload } from '../../../common/types';

@InputType()
export class ImportTeamsInput {
  @Field()
  environment: string;

  @Field(() => GraphQLUpload)
  file: {
    file: Promise<FileUpload>;
  };
}
