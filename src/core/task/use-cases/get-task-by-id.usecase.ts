import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { Task } from '../entities/task.entity';

@Injectable()
export class GetTaskByIdUseCase {
  async execute(gateway: TaskGateway, id: number): Promise<Task> {
    const task = await gateway.getTaskById(id);

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return task;
  }
}
