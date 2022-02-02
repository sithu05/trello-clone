import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../app/app.module';

const gql = '/graphql';

const lists = [{ id: 1, title: 'List One' }];

describe('GraphQL ListsResolver (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Lists Module', () => {
		describe('lists', () => {
			it('should get the lists array', () => {
				return request(app.getHttpServer())
					.post(gql)
					.send({ query: '{ lists { id title }}' })
					.expect(200)
					.expect((res) => {
						expect(res.body.data.lists).toEqual(lists);
					});
			});
		});

		describe('get list by Id', () => {
			it('should get a list', () => {
				const ID = 1;
				const result = lists.find((item) => item.id === ID);

				return request(app.getHttpServer())
					.post(gql)
					.send({ query: `{ list (id: ${ID}) { id title }}` })
					.expect(200)
					.expect((res) => {
						expect(res.body.data.list).toEqual(result);
					});
			});

			it('should get an error for bad id', () => {
				const ID = 400;

				return request(app.getHttpServer())
					.post(gql)
					.send({ query: `{ list (id: ${ID}) { id title }}` })
					.expect(200)
					.expect((res) => {
						expect(res.body.data).toBe(null);
						expect(res.body.errors[0].message).toBe(
							`No list with id ${ID} found`
						);
					});
			});
		});

		describe('should create a new list', () => {
			it('create a new list', () => {
				const title = 'New List One';

				return request(app.getHttpServer())
					.post(gql)
					.send({
						query: `mutation {
							createList(createListInput: { title: "${title}" }) {
								id
								title
							}
						}`,
					})
					.expect(200)
					.expect((res) => {
						expect(res.body.data.createList).toEqual({
							id: 2,
							title: title,
						});
					});
			});
		});
	});
});
