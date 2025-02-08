import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { DatabaseService } from '../../../../infrastructure/database/database.service';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { Task, TaskStatus } from '../../entities/task.entity';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: DatabaseService,
          useValue: {
            task: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };

    const createdTask = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      ...createTaskDto,
    };

    jest.spyOn(databaseService.task, 'create').mockResolvedValue(createdTask);

    const result = await taskRepository.createTask(1, createTaskDto);

    expect(result).toEqual(
      new Task(1, 'Test Task', 'Test Description', TaskStatus.PENDING),
    );
    expect(databaseService.task.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      },
    });
  });

  it('should get a task by id', async () => {
    const task = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    };

    jest.spyOn(databaseService.task, 'findUnique').mockResolvedValue(task);

    const result = await taskRepository.getTaskById(1);

    expect(result).toEqual(
      new Task(1, 'Test Task', 'Test Description', TaskStatus.PENDING),
    );
    expect(databaseService.task.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should return null if task not found by id', async () => {
    jest.spyOn(databaseService.task, 'findUnique').mockResolvedValue(null);

    const result = await taskRepository.getTaskById(1);

    expect(result).toBeNull();
    expect(databaseService.task.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should get tasks with pagination and status', async () => {
    const tasks = [
      {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        title: 'Test Task 1',
        description: 'Test Description 1',
        status: TaskStatus.PENDING,
      },
      {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        title: 'Test Task 2',
        description: 'Test Description 2',
        status: TaskStatus.PENDING,
      },
    ];

    jest.spyOn(databaseService.task, 'findMany').mockResolvedValue(tasks);
    jest.spyOn(databaseService.task, 'count').mockResolvedValue(2);

    const result = await taskRepository.getTasks(1, 2, {
      status: TaskStatus.PENDING,
    });

    expect(result).toEqual({
      data: [
        {
          description: 'Test Description 1',
          id: 1,
          status: 'PENDING',
          title: 'Test Task 1',
        },
        {
          description: 'Test Description 2',
          id: 2,
          status: 'PENDING',
          title: 'Test Task 2',
        },
      ],
      total: 2,
    });
    expect(databaseService.task.findMany).toHaveBeenCalledWith({
      where: { status: TaskStatus.PENDING },
      skip: 0,
      take: 2,
    });
  });

  it('should update a task', async () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      description: 'Updated Description',
      status: TaskStatus.IN_PROGRESS,
    };

    const updatedTask = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      ...updateTaskDto,
    };

    jest.spyOn(databaseService.task, 'update').mockResolvedValue(updatedTask);

    const result = await taskRepository.updateTask(1, updateTaskDto);

    expect(result).toEqual(
      new Task(
        1,
        'Updated Task',
        'Updated Description',
        TaskStatus.IN_PROGRESS,
      ),
    );
    expect(databaseService.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        title: 'Updated Task',
        description: 'Updated Description',
        status: TaskStatus.IN_PROGRESS,
      },
    });
  });
  it('should delete a task', async () => {
    await taskRepository.deleteTask(1);

    expect(databaseService.task.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
