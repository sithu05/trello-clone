import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Task } from './task.entity';

@Entity()
@ObjectType()
export class List {
	@PrimaryKey()
	@Field(() => Int)
	id: number;

	@Field()
	@Property()
	title: string;

	@Field(() => [Task], { nullable: 'items' })
	@OneToMany(() => Task, (task) => task.list)
	tasks = new Collection<Task>(this);

	constructor(title?: string) {
		this.title = title || '';
	}
}
