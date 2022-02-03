import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

import { List } from './entities/list.entity';
import { Task } from './entities/task.entity';

@Module({
	imports: [MikroOrmModule.forFeature([List, Task])],
	providers: [ListsResolver, ListsService],
	exports: [ListsService],
})
export class ListsModule {}
