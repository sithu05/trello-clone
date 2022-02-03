import { Test, TestingModule } from '@nestjs/testing';
import { CreateListInput } from '../dto/create-list.input';
import { List } from '../entities/list.entity';
import { ListsResolver } from '../lists.resolver';
import { ListsService } from '../lists.service';

const Lists = [new List('List One'), new List('List Two')];
const SingleList = new List('Single List');

describe('ListsResolver', () => {
	let resolver: ListsResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ListsResolver,
				{
					provide: ListsService,
					useValue: {
						findAll: jest.fn().mockResolvedValue(Lists),
						findOne: jest.fn().mockResolvedValue(SingleList),
						create: jest
							.fn()
							.mockImplementation((input: CreateListInput) =>
								Promise.resolve(new List(input.title))
							),
					},
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
			expect(resolver.findAll()).resolves.toEqual(Lists);
		});
	});

	describe('get list', () => {
		it('should get list by id', () => {
			const resolverSpy = jest.spyOn(resolver, 'findOne');

			expect(resolver.findOne(1)).resolves.toEqual(SingleList);
			expect(resolverSpy).toBeCalledWith(1);
		});
	});

	describe('add list', () => {
		it('should create a new list', () => {
			const resolverSpy = jest.spyOn(resolver, 'createList');

			expect(resolver.createList({ title: 'New List' })).resolves.toEqual(
				new List('New List')
			);
			expect(resolverSpy).toBeCalledWith({ title: 'New List' });
		});
	});
});
