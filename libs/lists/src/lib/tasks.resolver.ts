import {
	Args,
	Mutation,
	Resolver,
	Query,
	ResolveField,
	Parent,
	Int,
} from '@nestjs/graphql';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdatePositionTaskInput } from './dto/update-position-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

import { List } from './entities/list.entity';
import { Task } from './entities/task.entity';

import { ListsService } from './lists.service';
import { TasksService } from './tasks.service';

@Resolver(() => Task)
export class TasksResolver {
	constructor(
		private readonly tasksService: TasksService,
		private readonly listsService: ListsService
	) {}

	@Query(() => [Task], { name: 'tasks' })
	getTasks() {
		return this.tasksService.findAll();
	}

	@Mutation(() => Task)
	createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
		return this.tasksService.create(createTaskInput);
	}

	@Mutation(() => Task)
	updateTask(
		@Args('id', { type: () => Int }) id: number,
		@Args('updateTaskInput') updateTaskInput: UpdateTaskInput
	) {
		return this.tasksService.update(id, updateTaskInput);
	}

	@Mutation(() => Task)
	updateTaskPosition(
		@Args('id', { type: () => Int }) id: number,
		@Args('updatePositionTaskInput')
		updatePositionTaskInput: UpdatePositionTaskInput
	) {
		return this.tasksService.updatePosition(id, updatePositionTaskInput);
	}

	@ResolveField('list', () => List)
	getList(@Parent() task: Task) {
		return this.listsService.findOne(task.list.id);
	}
}
