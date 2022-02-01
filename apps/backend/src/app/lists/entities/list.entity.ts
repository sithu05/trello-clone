import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class List {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;
}
