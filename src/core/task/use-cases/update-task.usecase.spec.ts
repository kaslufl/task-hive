import { UpdateTaskUseCase } from './update-task.usecase';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { Task, TaskStatus } from '../entities/task.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase;
  let taskGateway: TaskGateway;

  beforeEach(() => {
    updateTaskUseCase = new UpdateTaskUseCase();
    taskGateway = {
      getTaskByIdAndUserId: jest.fn(),
      updateTask: jest.fn(),
    } as unknown as TaskGateway;
  });

  it('should update the task successfully', async () => {
    const taskId = 1;
    const userId = 1;
    const existingTask: Task = {
      id: taskId,
      title: 'Old Title',
      description: 'Old Description',
      status: TaskStatus.PENDING,
    };
    const updatedData: UpdateTaskDto = {
      title: 'New Title',
      description: 'New Title',
      status: TaskStatus.IN_PROGRESS,
    };
    const updatedTask: Task = { ...existingTask, ...updatedData };

    (taskGateway.getTaskByIdAndUserId as jest.Mock).mockResolvedValue(
      existingTask,
    );
    (taskGateway.updateTask as jest.Mock).mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(
      taskGateway,
      taskId,
      userId,
      updatedData,
    );

    expect(taskGateway.getTaskByIdAndUserId).toHaveBeenCalledWith(
      taskId,
      userId,
    );
    expect(taskGateway.updateTask).toHaveBeenCalledWith(taskId, updatedData);
    expect(result).toEqual(updatedTask);
  });

  it('should throw an error if the task is not found', async () => {
    const taskId = 1;
    const userId = 1;
    const updatedData: UpdateTaskDto = {
      title: 'New Title',
      description: 'New Title',
      status: TaskStatus.IN_PROGRESS,
    };
    (taskGateway.getTaskByIdAndUserId as jest.Mock).mockResolvedValue(null);

    await expect(
      updateTaskUseCase.execute(taskGateway, taskId, userId, updatedData),
    ).rejects.toThrow(
      new HttpException('Could not update', HttpStatus.BAD_REQUEST),
    );

    expect(taskGateway.getTaskByIdAndUserId).toHaveBeenCalledWith(
      taskId,
      userId,
    );
    expect(taskGateway.updateTask).not.toHaveBeenCalled();
  });

  it('should update the task with partial data', async () => {
    const taskId = 1;
    const userId = 1;
    const existingTask: Task = {
      id: taskId,
      title: 'Old Title',
      description: 'Old Description',
      status: TaskStatus.PENDING,
    };
    const updatedData: UpdateTaskDto = {
      title: 'New Title',
      description: 'New Title',
      status: TaskStatus.IN_PROGRESS,
    };
    const updatedTask: Task = { ...existingTask, ...updatedData };

    (taskGateway.getTaskByIdAndUserId as jest.Mock).mockResolvedValue(
      existingTask,
    );
    (taskGateway.updateTask as jest.Mock).mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(
      taskGateway,
      taskId,
      userId,
      updatedData,
    );

    expect(taskGateway.getTaskByIdAndUserId).toHaveBeenCalledWith(
      taskId,
      userId,
    );
    expect(taskGateway.updateTask).toHaveBeenCalledWith(taskId, updatedData);
    expect(result).toEqual(updatedTask);
  });
});
