import { Task } from '../task.entity';

describe('Task Class', () => {
	it('should make a task with no fields', () => {
		const task = new Task();

		expect(task).toBeTruthy();
		expect(task.title).toBe('');
	});

	it('should make a task with a tilte', () => {
		const task = new Task('New Task');

		expect(task).toBeTruthy();
		expect(task.title).toBe('New Task');
	});
});
