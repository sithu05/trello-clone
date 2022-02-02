import { List } from './list.entity';

describe('List Class', () => {
	it('should make a list with no fields', () => {
		const list = new List();
		expect(list).toBeTruthy();
		expect(list.title).toBe('');
	});
	it('should make a list with a tilte', () => {
		const list = new List('New List');
		expect(list).toBeTruthy();
		expect(list.title).toBe('New List');
	});
});
