import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateTaskInput } from './dto/create-task.input';
import { UpdatePositionTaskInput } from './dto/update-position-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

import { List } from './entities/list.entity';
import { Task } from './entities/task.entity';

import { ListRepository } from './repositories/list.repository';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {
	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly listRepository: ListRepository
	) {}

	async create(createTaskInput: CreateTaskInput) {
		try {
			const list = await this.listRepository.findOneOrFail(
				createTaskInput.list
			);

			const task = new Task(createTaskInput.title);
			task.list = list;

			await this.taskRepository.persistAndFlush(task);

			return task;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async update(id: number, updateTaskInput: UpdateTaskInput) {
		try {
			const task = await this.taskRepository.findOneOrFail(id);

			task.title = updateTaskInput.title;
			task.isCompleted = updateTaskInput.isCompleted;

			await this.taskRepository.persistAndFlush(task);

			return task;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async updatePosition(
		id: number,
		updatePositionTaskInput: UpdatePositionTaskInput
	) {
		try {
			const task = await this.taskRepository.findOneOrFail(id);

			task.sortBy = updatePositionTaskInput.position;

			await this.taskRepository.persistAndFlush(task);

			return task;
		} catch (err) {
			throw new Error(err);
		}
	}

	findAll() {
		return this.taskRepository.findAll();
	}

	findAllByList(list: List) {
		return this.taskRepository.find({ list });
	}
}
