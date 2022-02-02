import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';

import { List } from './entities/list.entity';
import { ListRepository } from './list.repository';

@Injectable()
export class ListsService {
	constructor(private readonly listRepository: ListRepository) {}

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

	async deleteOne(id: number) {
		const list = await this.findOne(id);

		await this.listRepository.removeAndFlush(list);

		return true;
	}
}
