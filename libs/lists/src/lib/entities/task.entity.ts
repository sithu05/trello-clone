import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { List } from './list.entity';

@Entity()
@ObjectType()
export class Task {
	@PrimaryKey()
	@Field(() => Int)
	id: number;

	@Field()
	@Property()
	title: string;

	@Field()
	@Property()
	isCompleted = false;

	@Property()
	@Field(() => Int)
	sortBy: number;

	@ManyToOne(() => List)
	@Field(() => List)
	list: List;

	constructor(title?: string) {
		this.title = title || '';
	}
}
