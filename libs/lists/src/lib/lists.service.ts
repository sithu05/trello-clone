import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';

import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
	constructor(
		@InjectRepository(List)
		private readonly listRepository: EntityRepository<List>
	) {}

	async create(createListInput: CreateListInput) {
		const list = new List(createListInput.title);

		await this.listRepository.persistAndFlush(list);

		return list;
	}

	findAll() {
		return this.listRepository.findAll();
	}

	async findOne(id: number) {
		try {
			return await this.listRepository.findOneOrFail(id);
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
