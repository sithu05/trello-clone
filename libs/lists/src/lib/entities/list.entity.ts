import {
	Collection,
	Entity,
	EntityRepositoryType,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ListRepository } from '../repositories/list.repository';
import { Task } from './task.entity';

@ObjectType()
@Entity({ customRepository: () => ListRepository })
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
