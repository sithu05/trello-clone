import { Test, TestingModule } from '@nestjs/testing';
import { CreateListInput } from './dto/create-list.input';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

const lists = [
	{ id: 1, title: 'List One' },
	{ id: 2, title: 'List Two' },
];

describe('ListsResolver', () => {
	let resolver: ListsResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ListsResolver,
				{
					provide: ListsService,
					useFactory: () => ({
						findAll: jest.fn().mockReturnValue(lists),
						findOne: jest.fn().mockImplementation((id: number) => {
							return lists.find((item) => item.id === id);
						}),
						create: jest
							.fn()
							.mockImplementation((input: CreateListInput) => ({
								id: 10,
								title: input.title,
							})),
					}),
				},
			],
		}).compile();

		resolver = module.get<ListsResolver>(ListsResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});

	describe('get lists', () => {
		it('should get the lists array', () => {
			expect(resolver.findAll()).toEqual(lists);
		});
	});

	describe('get list', () => {
		it('should get list by id', () => {
			const result = lists.find((item) => item.id === 1);

			expect(resolver.findOne(1)).toEqual(result);
		});
	});

	describe('add list', () => {
		it('should create a new list', () => {
			expect(resolver.createList({ title: 'New List' })).toEqual({
				id: 10,
				title: 'New List',
			});
		});
	});
});
