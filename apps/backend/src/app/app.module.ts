import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ListsModule } from '@trello-clone/lists';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		MikroOrmModule.forRoot({
			type: 'mysql',
			dbName: 'trello-clone',
			debug: true,
			autoLoadEntities: true,
			user: 'root',
			password: 'mypassword',
		}),

		ListsModule,

		GraphQLModule.forRoot({
			autoSchemaFile: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
	constructor(private readonly orm: MikroORM) {}

	async onApplicationBootstrap(): Promise<void> {
		const generator = this.orm.getSchemaGenerator();

		await generator.updateSchema();
	}
}
