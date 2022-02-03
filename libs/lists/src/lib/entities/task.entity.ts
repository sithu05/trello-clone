import {
	Entity,
	EntityRepositoryType,
	ManyToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TaskRepository } from '../repositories/task.repository';
import { List } from './list.entity';

@ObjectType()
@Entity({ customRepository: () => TaskRepository })
export class Task {
	[EntityRepositoryType]?: TaskRepository;

	@PrimaryKey()
	@Field(() => Int)
	id: number;

	@Field()
	@Property()
	title: string;

	@Property({ columnType: 'Boolean' })
	@Field(() => Boolean)
	isCompleted = false;

	@Property({ columnType: 'INT' })
	@Field(() => Int)
	sortBy = 0;

	@ManyToOne(() => List)
	@Field(() => List)
	list: List;

	constructor(title?: string) {
		this.title = title || '';
	}
}
