import { Injectable } from '@nestjs/common';
import { TaskGateway } from '../gateways/task.gateway';
import { Task } from '../../entities/task.entity';
import { GetTasksUseCase } from '../../use-cases/get-tasks.usecase';
import { Prisma } from '@prisma/client';

@Injectable()
export class GetTasksController {
  constructor(
    private readonly gateway: TaskGateway,
    private readonly usecase: GetTasksUseCase,
  ) {}

  async execute(
    page: number,
    limit: number,
    filters: Prisma.TaskWhereInput,
  ): Promise<{ data: Task[]; total: number }> {
    return await this.usecase.execute(this.gateway, page, limit, filters);
  }
}
