import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { Task } from '../entities/task.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class GetTasksUseCase {
  async execute(
    gateway: TaskGateway,
    page: number,
    limit: number,
    filters: Prisma.TaskWhereInput,
  ): Promise<{ data: Task[]; total: number }> {
    const tasks = await gateway.getTasks(page, limit, filters);

    if (!tasks.data.length) {
      throw new HttpException('Tasks not found', HttpStatus.NOT_FOUND);
    }

    return tasks;
  }
}
