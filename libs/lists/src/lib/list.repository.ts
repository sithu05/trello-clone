import { EntityRepository } from '@mikro-orm/core';
import { List } from './entities/list.entity';

export class ListRepository extends EntityRepository<List> {}
