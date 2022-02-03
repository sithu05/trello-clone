import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ListsService, TasksService } from '@trello-clone/lists';
import * as request from 'supertest';

import { AppModule } from '../app/app.module';

const gql = '/graphql';

describe('GraphQL ListsResolver (e2e)', () => {
	let app: INestApplication;
	let listsService: ListsService;
	let tasksService: TasksService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		listsService = moduleRef.get<ListsService>(ListsService);
		tasksService = moduleRef.get<TasksService>(TasksService);

		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Lists Module', () => {
		// clear the data before tests
		beforeEach(async () => {
			const lists = await request(app.getHttpServer())
				.post(gql)
				.send({ query: '{ lists { id title }}' })
				.expect(200);

			await Promise.all(
				lists.body.data.lists.map(async (list) => {
					return await listsService.deleteOne(list.id);
				})
			);
		});

		it('create list, get all lists, get by id', async () => {
			const title = 'New List From Test';

			const created = await request(app.getHttpServer())
				.post(gql)
				.send({
					query: `mutation {
							createList(createListInput: { title: "${title}" }) {
								id
								title
							}
						}`,
				})
				.expect(200);

			expect(created.body.data.createList).toEqual({
				title,
				id: expect.any(Number),
			});

			// ------------------ Create List ------------------------

			const lists = await request(app.getHttpServer())
				.post(gql)
				.send({ query: '{ lists { id title }}' })
				.expect(200);

			expect(lists.body.data.lists).toEqual(expect.any(Array));
			expect(lists.body.data.lists.length).toBe(1);
			expect(lists.body.data.lists[0]).toEqual({
				...created.body.data.createList,
				id: expect.any(Number),
			});

			// ------------------ Get All Lists ------------------------

			const detail = await request(app.getHttpServer())
				.post(gql)
				.send({
					query: `{ list (id: ${created.body.data.createList.id}) { id title }}`,
				})
				.expect(200);

			expect(detail.body.data.list).toEqual(created.body.data.createList);

			const notFound = await request(app.getHttpServer())
				.post(gql)
				.send({
					query: `{ list (id: 2) { id title }}`,
				})
				.expect(200);

			expect(notFound.body.data).toBe(null);
			expect(notFound.body.errors[0].message).toBe(`List not found (2)`);

			// ------------------ Get List By ID ------------------------
		});
	});

	// describe('Tasks Module', () => {
	// 	// clear the data before tests
	// 	beforeEach(async () => {
	// 		const tasks = await request(app.getHttpServer())
	// 			.post(gql)
	// 			.send({ query: '{ tasks { id }}' })
	// 			.expect(200);

	// 		await Promise.all(
	// 			tasks.body.data.tasks.map(async (task) => {
	// 				return await tasksService.deleteOne(task.id);
	// 			})
	// 		);
	// 	});

	// 	it('create a list, create tasks with list, get tasks, get task, lists with tasks', async () => {
	// 		let createdList;

	// 		await request(app.getHttpServer())
	// 			.post(gql)
	// 			.send({
	// 				query: `mutation {
	// 						createList(createListInput: { title: "List One" }) {
	// 							id
	// 							title
	// 						}
	// 					}`,
	// 			})
	// 			.expect(200)
	// 			.expect((res) => {
	// 				createdList = res.body.data.createList;
	// 			});

	// 		const created = await request(app.getHttpServer())
	// 			.post(gql)
	// 			.send({
	// 				query: `mutation {
	// 						createTask(createTaskInput: { title: "New Task", list: ${createdList.id} }) {
	// 							id
	// 							title
	// 							list {
	// 								id
	// 								title
	// 							}
	// 						}
	// 					}`,
	// 			})
	// 			.expect(200);

	// 		expect(created.body.data.createTask).toEqual({
	// 			title: 'New Task',
	// 			id: expect.any(Number),
	// 			list: createdList,
	// 		});
	// 	});
	// });
});
