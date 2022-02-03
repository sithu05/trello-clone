import { EntityRepository } from '@mikro-orm/core';
import { Task } from '../entities/task.entity';

export class TaskRepository extends EntityRepository<Task> {}
