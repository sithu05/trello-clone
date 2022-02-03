import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../app/app.module';

const gql = '/graphql';

describe('GraphQL ListsResolver (e2e)', () => {
	let app: INestApplication;
	let orm: MikroORM;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		orm = moduleRef.get<MikroORM>(MikroORM);

		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Lists Module', () => {
		// clear the data before tests
		beforeEach(async () => {
			const generator = orm.getSchemaGenerator();

			await generator.dropSchema();
			await generator.createSchema();
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

	describe('Tasks Module', () => {
		// clear the data before tests
		beforeEach(async () => {
			const generator = orm.getSchemaGenerator();

			await generator.dropSchema();
			await generator.createSchema();
		});

		it('create a list, create tasks with list, get tasks, get task, lists with tasks', async () => {
			let createdList;

			await request(app.getHttpServer())
				.post(gql)
				.send({
					query: `mutation {
							createList(createListInput: { title: "List One" }) {
								id
								title
							}
						}`,
				})
				.expect(200)
				.expect((res) => {
					createdList = res.body.data.createList;
				});

			// ----------------- Create List --------------------------

			const created = await request(app.getHttpServer())
				.post(gql)
				.send({
					query: `mutation {
							createTask(createTaskInput: { title: "New Task", list: ${createdList.id} }) {
								id
								title
								list {
									id
									title
								}
							}
						}`,
				})
				.expect(200);

			expect(created.body.data.createTask).toEqual({
				title: 'New Task',
				id: expect.any(Number),
				list: createdList,
			});

			// ----------------- Create Task --------------------------

			const updated = await request(app.getHttpServer())
				.post(gql)
				.send({
					query: `mutation {
							updateTask(id: ${created.body.data.createTask.id}, updateTaskInput: { title: "Updated Task", isCompleted: true }) {
								id
								title
								isCompleted
							}
						}`,
				})
				.expect(200);

			expect(updated.body.data.updateTask).toEqual({
				id: created.body.data.createTask.id,
				title: 'Updated Task',
				isCompleted: true,
			});

			// ----------------- Update Task --------------------------

			const updatedPosition = await request(app.getHttpServer())
				.post(gql)
				.send({
					query: `mutation {
							updateTaskPosition(id: ${created.body.data.createTask.id}, updatePositionTaskInput: { position: 400 }) {
								id
								sortBy
							}
						}`,
				})
				.expect(200);

			expect(updatedPosition.body.data.updateTaskPosition).toEqual({
				id: created.body.data.createTask.id,
				sortBy: 400,
			});

			// ----------------- Update Task Position --------------------------

			const lists = await request(app.getHttpServer())
				.post(gql)
				.send({ query: '{ lists { id title tasks { id } }}' })
				.expect(200);

			expect(lists.body.data.lists).toEqual(expect.any(Array));
			expect(lists.body.data.lists.length).toBe(1);

			expect(lists.body.data.lists[0].tasks).toEqual(expect.any(Array));
			expect(lists.body.data.lists[0].tasks.length).toBe(1);

			expect(lists.body.data.lists[0]).toEqual({
				id: createdList.id,
				title: createdList.title,
				tasks: [{ id: created.body.data.createTask.id }],
			});
		});
	});
});
