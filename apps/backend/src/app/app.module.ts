import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ListsModule } from '@trello-clone/lists';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ListsModule,

		GraphQLModule.forRoot({
			autoSchemaFile: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
