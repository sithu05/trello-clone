import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

import { List } from './entities/list.entity';
import { Task } from './entities/task.entity';

import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';

@Module({
	imports: [MikroOrmModule.forFeature([List, Task])],
	providers: [ListsResolver, ListsService, TasksService, TasksResolver],
	exports: [ListsService],
})
export class ListsModule {}
