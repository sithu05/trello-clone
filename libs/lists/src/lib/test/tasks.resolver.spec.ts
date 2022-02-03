import { Test, TestingModule } from '@nestjs/testing';

import { CreateTaskInput } from '../dto/create-task.input';

import { TasksResolver } from '../tasks.resolver';

import { ListsService } from '../lists.service';
import { TasksService } from '../tasks.service';
import { UpdateTaskInput } from '../dto/update-task.input';

describe('Tasks Resolver', () => {
	let resolver: TasksResolver;

	const mockTasksService = {
		findAll: jest.fn().mockResolvedValue([]),
		update: jest
			.fn()
			.mockImplementation((id: number, input: UpdateTaskInput) =>
				Promise.resolve({
					id,
					...input,
				})
			),
		create: jest.fn().mockImplementation((input: CreateTaskInput) =>
			Promise.resolve({
				title: input.title,
				list: {
					id: input.list,
				},
			})
		),
	};

	const mockListsService = {
		findOne: jest
			.fn()
			.mockResolvedValue({ id: Date.now(), title: 'List One' }),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasksResolver,
				TasksService,
				ListsService,
				// {
				// 	provide: ListsService,
				// 	useValue: {
				// 		findAll: jest.fn().mockResolvedValue(Lists),
				// 		findOne: jest.fn().mockResolvedValue(SingleList),
				// 		create: jest
				// 			.fn()
				// 			.mockImplementation((input: CreateListInput) =>
				// 				Promise.resolve(new List(input.title))
				// 			),
				// 	},
				// },
			],
		})
			.overrideProvider(TasksService)
			.useValue(mockTasksService)
			.overrideProvider(ListsService)
			.useValue(mockListsService)
			.compile();

		resolver = module.get<TasksResolver>(TasksResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});

	describe('get tasks', () => {
		it('should get the tasks array', () => {
			expect(resolver.getTasks()).resolves.toEqual([]);
		});
	});

	describe('add task', () => {
		it('should create a new task', async () => {
			await expect(
				resolver.createTask({ title: 'New Task', list: 5 })
			).resolves.toEqual({
				title: 'New Task',
				list: {
					id: 5,
				},
			});
		});
	});

	describe('add task', () => {
		it('should create a new task', async () => {
			await expect(
				resolver.createTask({ title: 'New Task', list: 5 })
			).resolves.toEqual({
				title: 'New Task',
				list: {
					id: 5,
				},
			});
		});
	});

	describe('update task', () => {
		it('should update task', async () => {
			await expect(
				resolver.updateTask(5, {
					title: 'Updated Task',
					isCompleted: true,
				})
			).resolves.toEqual({
				id: 5,
				title: 'Updated Task',
				isCompleted: true,
			});
		});
	});
});
