import { EntityRepository } from '@mikro-orm/core';
import { Task } from '..';

export class TaskRepository extends EntityRepository<Task> {}
