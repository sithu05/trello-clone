import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';

import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
	private lists: List[] = [{ id: 1, title: 'List One' }];

	create(createListInput: CreateListInput) {
		const id = this.lists.length + 1;

		this.lists.push({ id: id, title: createListInput.title });

		return this.findOne(id);
	}

	findAll() {
		return this.lists;
	}

	findOne(id: number) {
		const list = this.lists.find((item) => item.id === id);

		if (!list) throw new BadRequestException(`No list with id ${id} found`);

		return list;
	}

	update(id: number, updateListInput: UpdateListInput) {
		return `This action updates a #${id} list`;
	}

	remove(id: number) {
		return `This action removes a #${id} list`;
	}
}
