import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTaskUseCase } from './delete-task.usecase';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { TaskStatus } from '../entities/task.entity';

describe('DeleteTaskUseCase', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
  let taskGateway: TaskGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTaskUseCase,
        {
          provide: TaskGateway,
          useValue: {
            deleteTask: jest.fn(),
            getTaskByIdAndUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteTaskUseCase = module.get<DeleteTaskUseCase>(DeleteTaskUseCase);
    taskGateway = module.get<TaskGateway>(TaskGateway);
  });

  it('should be defined', () => {
    expect(deleteTaskUseCase).toBeDefined();
  });

  it('should call deleteTask on the gateway with the correct taskId', async () => {
    const taskId = 1;
    const userId = 1;
    const task = {
      id: 1,
      title: 'title',
      description: 'title',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: TaskStatus.DONE,
      userId: 1,
    };
    jest.spyOn(taskGateway, 'getTaskByIdAndUserId').mockResolvedValue(task);

    await deleteTaskUseCase.execute(taskGateway, taskId, userId);
    expect(taskGateway.deleteTask).toHaveBeenCalledWith(taskId);
  });

  it('should throw an error if deleteTask fails', async () => {
    const taskId = 1;
    const userId = 1;

    jest.spyOn(taskGateway, 'deleteTask').mockRejectedValue(new Error());

    await expect(
      deleteTaskUseCase.execute(taskGateway, taskId, userId),
    ).rejects.toThrow('Could not delete');
  });
});
