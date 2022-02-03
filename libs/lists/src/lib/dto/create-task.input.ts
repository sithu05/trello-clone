import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
	@Field()
	title: string;

	@Field(() => Int)
	list: number;
}
