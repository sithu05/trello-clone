import { Test, TestingModule } from '@nestjs/testing';

import { TaskRepository } from '../task.repository';
import { TasksService } from '../tasks.service';

describe('TasksService', () => {
	let service: TasksService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: TaskRepository,
					useValue: {
						findAll: jest.fn().mockResolvedValue([]),
						findOneOrFail: jest.fn().mockResolvedValue({}),
					},
				},
			],
		}).compile();

		service = module.get<TasksService>(TasksService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
