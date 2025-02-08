import { Injectable } from '@nestjs/common';
import { TaskGateway } from '../gateways/task.gateway';
import { Task } from '../../entities/task.entity';
import { GetTaskByIdUseCase } from '../../use-cases/get-task-by-id.usecase';

@Injectable()
export class GetTaskController {
  constructor(
    private readonly gateway: TaskGateway,
    private readonly usecase: GetTaskByIdUseCase,
  ) {}

  async execute(taskId: number): Promise<Task> {
    return await this.usecase.execute(this.gateway, taskId);
  }
}
