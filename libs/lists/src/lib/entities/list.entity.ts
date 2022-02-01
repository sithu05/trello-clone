import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class List {
	@Field(() => Int)
	id: number;

	@Field()
	title: string;
}
