import { Injectable } from '@nestjs/common';
import { TaskGateway } from '../gateways/task.gateway';
import { Task } from '../../entities/task.entity';
import { UpdateTaskUseCase } from '../../use-cases/update-task.usecase';
import { UpdateTaskDto } from '../../dto/update-task.dto';

@Injectable()
export class UpdateTaskController {
  constructor(
    private readonly gateway: TaskGateway,
    private readonly usecase: UpdateTaskUseCase,
  ) {}

  async execute(
    taskId: number,
    userId: number,
    task: UpdateTaskDto,
  ): Promise<Task> {
    return await this.usecase.execute(this.gateway, taskId, userId, task);
  }
}
