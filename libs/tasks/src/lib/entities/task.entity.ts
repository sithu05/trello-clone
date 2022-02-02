import {
	Entity,
	EntityRepositoryType,
	ManyToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { List } from '@trello-clone/lists';

import { TaskRepository } from '../task.repository';

@Entity({ customRepository: () => TaskRepository })
// @ObjectType()
export class Task {
	[EntityRepositoryType]?: TaskRepository;

	@PrimaryKey()
	// @Field(() => Int)
	id: number;

	// @Field()
	@Property()
	title: string;

	// @Field()
	@Property()
	isCompleted: boolean;

	@Property()
	@Field(() => Int)
	sorter: number;

	@ManyToOne(() => List)
	list: List;

	// @Field(() => List)
	// @Property()
	// listID: number;

	constructor(title?: string) {
		this.title = title || '';
		this.isCompleted = false;
		this.sorter = 0;
	}
}
