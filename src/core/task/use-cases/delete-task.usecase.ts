import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskGateway } from '../adapters/gateways/task.gateway';

@Injectable()
export class DeleteTaskUseCase {
  async execute(
    gateway: TaskGateway,
    taskId: number,
    userId: number,
  ): Promise<void> {
    const task = await gateway.getTaskByIdAndUserId(taskId, userId);

    if (!task) {
      throw new HttpException('Could not delete', HttpStatus.BAD_REQUEST);
    }

    await gateway.deleteTask(taskId);
  }
}
