import { Test, TestingModule } from '@nestjs/testing';

import { List } from '../entities/list.entity';

import { ListRepository } from '../repositories/list.repository';
import { TaskRepository } from '../repositories/task.repository';
import { TasksService } from '../tasks.service';

describe('Tasks Service', () => {
	let service: TasksService;

	const mockTaskRepository = {
		find: jest.fn().mockResolvedValue([]),
		findAll: jest.fn().mockResolvedValue([]),
		findOneOrFail: jest.fn().mockImplementation((id) =>
			Promise.resolve({
				title: 'Task One',
				isCompleted: false,
				sortBy: 0,
				id,
			})
		),
		persistAndFlush: jest
			.fn()
			.mockImplementation((payload) => Promise.resolve({ ...payload })),
		removeAndFlush: jest.fn().mockImplementation(() => Promise.resolve()),
	};

	const mockListRepository = {
		findOneOrFail: jest.fn().mockResolvedValue({
			title: 'List One',
		}),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TasksService, TaskRepository, ListRepository],
		})

			.overrideProvider(TaskRepository)
			.useValue(mockTaskRepository)
			.overrideProvider(ListRepository)
			.useValue(mockListRepository)
			.compile();

		service = module.get<TasksService>(TasksService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get array of tasks', async () => {
		await expect(service.findAll()).resolves.toEqual([]);
	});

	it('should get tasks of list', async () => {
		await expect(service.findAllByList(new List())).resolves.toEqual([]);
	});

	it('should create a task', async () => {
		await expect(
			service.create({ title: 'New Task', list: 1 })
		).resolves.toEqual({
			title: 'New Task',
			isCompleted: false,
			sortBy: 0,
			list: {
				title: 'List One',
			},
		});
	});

	it('should update task', async () => {
		await expect(
			service.update(5, { title: 'Updated Task', isCompleted: true })
		).resolves.toEqual({
			id: 5,
			title: 'Updated Task',
			isCompleted: true,
			sortBy: expect.any(Number),
		});
	});

	it('should update task position', async () => {
		await expect(
			service.updatePosition(5, { position: 100 })
		).resolves.toEqual({
			id: 5,
			title: expect.any(String),
			isCompleted: expect.any(Boolean),
			sortBy: 100,
		});
	});

	it('should delete a task by id', async () => {
		await expect(service.deleteOne(1)).resolves.toEqual(true);
	});
});
