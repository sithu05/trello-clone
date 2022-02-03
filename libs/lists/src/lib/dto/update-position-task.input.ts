import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdatePositionTaskInput {
	@Field(() => Int)
	position: number;
}
