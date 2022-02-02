import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

import { List } from './entities/list.entity';
import { TasksModule } from '@trello-clone/tasks';

@Module({
	imports: [TasksModule, MikroOrmModule.forFeature({ entities: [List] })],
	providers: [ListsResolver, ListsService],
	exports: [ListsService],
})
export class ListsModule {}
