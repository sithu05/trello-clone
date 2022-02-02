import { Resolver } from '@nestjs/graphql';

import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Resolver(() => Task)
export class TasksResolver {
	constructor(private readonly tasksService: TasksService) {}
}
