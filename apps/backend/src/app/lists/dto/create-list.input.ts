import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateListInput {
  @Field()
  title: string;
}
