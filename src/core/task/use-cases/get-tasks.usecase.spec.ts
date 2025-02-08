import { Test, TestingModule } from '@nestjs/testing';
import { GetTasksUseCase } from './get-tasks.usecase';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Task, TaskStatus } from '../entities/task.entity';
import { Prisma } from '@prisma/client';

describe('GetTasksUseCase', () => {
  let useCase: GetTasksUseCase;
  let gateway: TaskGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTasksUseCase,
        {
          provide: TaskGateway,
          useValue: {
            getTasks: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetTasksUseCase>(GetTasksUseCase);
    gateway = module.get<TaskGateway>(TaskGateway);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return tasks and total count', async () => {
    const tasks: Task[] = [
      {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      },
    ];
    const total = 1;
    const result = { data: tasks, total };
    jest.spyOn(gateway, 'getTasks').mockResolvedValue(result);

    const filters: Prisma.TaskWhereInput = {
      status: { equals: TaskStatus.PENDING },
    };
    const response = await useCase.execute(gateway, 1, 10, filters);

    expect(response).toEqual(result);
    expect(gateway.getTasks).toHaveBeenCalledWith(1, 10, filters);
  });

  it('should throw HttpException if tasks not found', async () => {
    jest.spyOn(gateway, 'getTasks').mockResolvedValue({ data: [], total: 0 });

    const filters: Prisma.TaskWhereInput = {
      status: { equals: TaskStatus.DONE },
    };
    await expect(useCase.execute(gateway, 1, 10, filters)).rejects.toThrow(
      new HttpException('Tasks not found', HttpStatus.NOT_FOUND),
    );
  });
});
