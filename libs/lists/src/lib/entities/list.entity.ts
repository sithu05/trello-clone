import {
	Collection,
	Entity,
	EntityRepositoryType,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Task } from '@trello-clone/tasks';

import { ListRepository } from '../list.repository';

@Entity({ customRepository: () => ListRepository })
@ObjectType()
export class List {
	[EntityRepositoryType]?: ListRepository;

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
