import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class List {
	@PrimaryKey()
	@Field(() => Int)
	id: number;

	@Field()
	@Property()
	title: string;

	constructor(title?: string) {
		this.title = title || '';
	}
}
