import { EntityRepository, MikroORM, NotFoundError } from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { List } from '../entities/list.entity';
import { ListsService } from '../lists.service';
import { ListRepository } from '../repositories/list.repository';

const Lists = [new List('List One'), new List('List Two')];
const SingleList = new List('List Detail');

describe('ListsService', () => {
	let service: ListsService;
	let repo: EntityRepository<List>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ListsService,
				{
					provide: ListRepository,
					useValue: {
						findAll: jest.fn().mockResolvedValue(Lists),
						findOneOrFail: jest.fn().mockResolvedValue(SingleList),
					},
				},
				{
					provide: MikroORM,
					useValue: {},
				},
			],
		}).compile();

		service = module.get<ListsService>(ListsService);
		repo = module.get<ListRepository>(ListRepository);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('get lists', () => {
		it('should return a array of lists', async () => {
			const lists = await service.findAll();

			expect(lists).toEqual(Lists);
		});
	});

	describe('get list by id', () => {
		it('should successfully return a cat', async () => {
			const repoSpy = jest.spyOn(repo, 'findOneOrFail');

			expect(service.findOne(1)).resolves.toEqual(SingleList);
			expect(repoSpy).toBeCalledWith(1);
		});

		it('should get an error for unknown id', async () => {
			const ID = 3;

			const repoSpy = jest
				.spyOn(repo, 'findOneOrFail')
				.mockRejectedValueOnce(
					new NotFoundError(`List not found (${3})`)
				);

			await expect(service.findOne(ID)).rejects.toThrowError(
				new BadRequestException(`List not found (${3})`)
			);
			expect(repoSpy).toBeCalledWith(ID);
		});
	});

	describe('new list', () => {
		it('should a list to the arry', () => {
			const serviceSpy = jest
				.spyOn(service, 'create')
				.mockResolvedValue(SingleList);

			expect(
				service.create({ title: SingleList.title })
			).resolves.toEqual(SingleList);
			expect(serviceSpy).toBeCalledWith({ title: SingleList.title });
		});
	});

	describe('delete a list', () => {
		it('should delete a list by id', () => {
			const serviceSpy = jest
				.spyOn(service, 'deleteOne')
				.mockResolvedValue(true);

			expect(service.deleteOne(1)).resolves.toEqual(true);
			expect(serviceSpy).toBeCalledTimes(1);
		});
	});
});
