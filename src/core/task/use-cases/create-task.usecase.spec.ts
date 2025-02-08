import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskUseCase } from './create-task.usecase';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task, TaskStatus } from '../entities/task.entity';

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let taskGateway: TaskGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: TaskGateway,
          useValue: {
            createTask: jest.fn(),
          },
        },
      ],
    }).compile();

    createTaskUseCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
    taskGateway = module.get<TaskGateway>(TaskGateway);
  });

  it('should be defined', () => {
    expect(createTaskUseCase).toBeDefined();
  });

  it('should create a task', async () => {
    const taskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };
    const userId = 1;
    const createdTask: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };

    jest.spyOn(taskGateway, 'createTask').mockResolvedValue(createdTask);

    const result = await createTaskUseCase.execute(
      taskGateway,
      taskDto,
      userId,
    );

    expect(result).toEqual(createdTask);
    expect(taskGateway.createTask).toHaveBeenCalledWith(userId, taskDto);
  });

  it('should throw an error if task creation fails', async () => {
    const taskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };
    const userId = 1;

    jest
      .spyOn(taskGateway, 'createTask')
      .mockRejectedValue(new Error('Task creation failed'));

    await expect(
      createTaskUseCase.execute(taskGateway, taskDto, userId),
    ).rejects.toThrow('Task creation failed');
  });
});
