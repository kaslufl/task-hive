import { Test, TestingModule } from '@nestjs/testing';
import { GetTaskByIdUseCase } from './get-task-by-id.usecase';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { Task, TaskStatus } from '../entities/task.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('getTaskByIdUseCase', () => {
  let useCase: GetTaskByIdUseCase;
  let gateway: TaskGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTaskByIdUseCase,
        {
          provide: TaskGateway,
          useValue: {
            getTaskById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetTaskByIdUseCase>(GetTaskByIdUseCase);
    gateway = module.get<TaskGateway>(TaskGateway);
  });

  it('should return a task if found', async () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };
    jest.spyOn(gateway, 'getTaskById').mockResolvedValue(task);

    const result = await useCase.execute(gateway, 1);
    expect(result).toEqual(task);
  });

  it('should throw an HttpException if task not found', async () => {
    jest.spyOn(gateway, 'getTaskById').mockResolvedValue(null);

    await expect(useCase.execute(gateway, 1)).rejects.toThrow(
      new HttpException('Task not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should call getTaskById with correct id', async () => {
    const task: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };
    jest.spyOn(gateway, 'getTaskById').mockResolvedValue(task);

    await useCase.execute(gateway, 1);
    expect(gateway.getTaskById).toHaveBeenCalledWith(1);
  });
});
