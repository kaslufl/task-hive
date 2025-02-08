import { Task, TaskStatus } from './task.entity';

describe('Task Entity', () => {
  it('should create a task with given properties', () => {
    const task = new Task(
      1,
      'Test Task',
      'This is a test task',
      TaskStatus.PENDING,
    );

    expect(task.id).toBe(1);
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task');
    expect(task.status).toBe(TaskStatus.PENDING);
  });

  it('should have a status of PENDING', () => {
    const task = new Task(
      2,
      'Another Task',
      'This is another test task',
      TaskStatus.PENDING,
    );

    expect(task.status).toBe(TaskStatus.PENDING);
  });

  it('should have a status of IN_PROGRESS', () => {
    const task = new Task(
      3,
      'In Progress Task',
      'This task is in progress',
      TaskStatus.IN_PROGRESS,
    );

    expect(task.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should have a status of DONE', () => {
    const task = new Task(4, 'Done Task', 'This task is done', TaskStatus.DONE);

    expect(task.status).toBe(TaskStatus.DONE);
  });

  it('should throw an error if status is invalid', () => {
    expect(() => {
      new Task(
        5,
        'Invalid Task',
        'This task has an invalid status',
        'INVALID_STATUS' as TaskStatus,
      );
    }).toThrow();
  });
});
