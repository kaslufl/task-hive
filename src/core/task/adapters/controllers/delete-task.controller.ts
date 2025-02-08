import { Injectable } from '@nestjs/common';
import { TaskGateway } from '../gateways/task.gateway';
import { DeleteTaskUseCase } from '../../use-cases/delete-task.usecase';

@Injectable()
export class DeleteTaskController {
  constructor(
    private readonly gateway: TaskGateway,
    private readonly usecase: DeleteTaskUseCase,
  ) {}

  async execute(taskId: number, userId: number): Promise<void> {
    await this.usecase.execute(this.gateway, taskId, userId);
  }
}
