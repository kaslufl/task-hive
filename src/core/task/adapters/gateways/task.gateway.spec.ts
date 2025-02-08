import { Test, TestingModule } from '@nestjs/testing';
import { TaskGateway } from './task.gateway';
import { ITaskRepository } from '../../external/repository/task.repository.interface';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { TaskStatus } from '../../entities/task.entity';
import { Prisma } from '@prisma/client';

describe('TaskGateway', () => {
  let taskGateway: TaskGateway;
  let taskRepository: ITaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskGateway,
        {
          provide: ITaskRepository,
          useValue: {
            createTask: jest.fn(),
            getTaskById: jest.fn(),
            getTasks: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
      ],
    }).compile();

    taskGateway = module.get<TaskGateway>(TaskGateway);
    taskRepository = module.get<ITaskRepository>(ITaskRepository);
  });

  it('should be defined', () => {
    expect(taskGateway).toBeDefined();
  });

  it('should create a task', async () => {
    const userId = 1;
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };
    const result = { id: 1, ...createTaskDto };

    jest.spyOn(taskRepository, 'createTask').mockResolvedValue(result);

    expect(await taskGateway.createTask(userId, createTaskDto)).toEqual(result);
    expect(taskRepository.createTask).toHaveBeenCalledWith(
      userId,
      createTaskDto,
    );
  });

  it('should get a task by id', async () => {
    const taskId = 1;
    const result = {
      id: taskId,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };

    jest.spyOn(taskRepository, 'getTaskById').mockResolvedValue(result);

    expect(await taskGateway.getTaskById(taskId)).toEqual(result);
    expect(taskRepository.getTaskById).toHaveBeenCalledWith(taskId);
  });

  it('should get tasks with filters', async () => {
    const page = 1;
    const limit = 10;
    const filters: Prisma.TaskWhereInput = {
      status: { equals: TaskStatus.DONE },
    };
    const result = {
      data: [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.DONE,
        },
      ],
      total: 1,
    };

    jest.spyOn(taskRepository, 'getTasks').mockResolvedValue(result);

    expect(await taskGateway.getTasks(page, limit, filters)).toEqual(result);
    expect(taskRepository.getTasks).toHaveBeenCalledWith(page, limit, filters);
  });

  it('should update a task', async () => {
    const taskId = 1;
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      status: TaskStatus.IN_PROGRESS,
    };
    const result = { id: taskId, ...updateTaskDto };

    jest.spyOn(taskRepository, 'updateTask').mockResolvedValue(result);

    expect(await taskGateway.updateTask(taskId, updateTaskDto)).toEqual(result);
    expect(taskRepository.updateTask).toHaveBeenCalledWith(
      taskId,
      updateTaskDto,
    );
  });
  it('should delete a task', async () => {
    const taskId = 1;

    expect(await taskGateway.deleteTask(taskId)).toBeUndefined();
    expect(taskRepository.deleteTask).toHaveBeenCalledWith(taskId);
  });
});
