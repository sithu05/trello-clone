import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ListsService } from './lists.service';

describe('ListsService', () => {
	let service: ListsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ListsService],
		}).compile();

		service = module.get<ListsService>(ListsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('get lists', () => {
		it('should return a array of lists', () => {
			expect(service.findAll()).toEqual([
				{
					id: 1,
					title: 'List One',
				},
			]);
		});
	});

	describe('get list by id', () => {
		it('should successfully return a cat', () => {
			expect(service.findOne(1)).toEqual({
				id: 1,
				title: 'List One',
			});
		});

		it('should throw an error', () => {
			const noIdCall = () => service.findOne(0);

			expect(noIdCall).toThrowError(BadRequestException);
			expect(noIdCall).toThrowError('No list with id 0 found');
		});
	});

	describe('new list', () => {
		it('should a list to the arry', () => {
			expect(service.create({ title: 'New List One' })).toEqual({
				id: 2,
				title: 'New List One',
			});
		});
	});
});
