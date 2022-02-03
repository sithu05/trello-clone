import {
	Resolver,
	Query,
	Mutation,
	Args,
	Int,
	ResolveField,
	Parent,
} from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { TasksService } from './tasks.service';

import { List } from './entities/list.entity';
import { Task } from './entities/task.entity';

import { CreateListInput } from './dto/create-list.input';

@Resolver(() => List)
export class ListsResolver {
	constructor(
		private readonly listsService: ListsService,
		private readonly tasksService: TasksService
	) {}

	@Mutation(() => List)
	createList(@Args('createListInput') createListInput: CreateListInput) {
		return this.listsService.create(createListInput);
	}

	@Query(() => [List], { name: 'lists' })
	findAll() {
		return this.listsService.findAll();
	}

	@Query(() => List, { name: 'list' })
	findOne(@Args('id', { type: () => Int }) id: number) {
		return this.listsService.findOne(id);
	}

	@ResolveField('tasks', () => [Task])
	getTasks(@Parent() list: List) {
		return this.tasksService.findAllByList(list);
	}
}
