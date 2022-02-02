import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ListsService } from '@trello-clone/lists';
import * as request from 'supertest';

import { AppModule } from '../app/app.module';

const gql = '/graphql';

describe('GraphQL ListsResolver (e2e)', () => {
	let app: INestApplication;
	let listsService: ListsService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		listsService = moduleRef.get<ListsService>(ListsService);

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
					return listsService.deleteOne(list.id);
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
});
