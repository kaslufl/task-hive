import { Task } from '../entities/task.entity';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateTaskUseCase {
  async execute(
    gateway: TaskGateway,
    task: CreateTaskDto,
    userId: number,
  ): Promise<Task> {
    return await gateway.createTask(userId, task);
  }
}
