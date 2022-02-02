import { Injectable } from '@nestjs/common';

import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
	constructor(private readonly taskRepository: TaskRepository) {}
}
