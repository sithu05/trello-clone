import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

import { List } from './entities/list.entity';

@Module({
	imports: [MikroOrmModule.forFeature({ entities: [List] })],
	providers: [ListsResolver, ListsService],
	exports: [ListsService],
})
export class ListsModule {}
