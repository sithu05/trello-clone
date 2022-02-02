import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Task } from './entities/task.entity';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
	imports: [MikroOrmModule.forFeature([Task])],
	controllers: [],
	providers: [TasksResolver, TasksService],
	exports: [TasksService],
})
export class TasksModule {}
