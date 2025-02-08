import { Injectable } from '@nestjs/common';
import { CreateTaskUseCase } from '../../use-cases/create-task.usecase';
import { TaskGateway } from '../gateways/task.gateway';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { Task } from '../../entities/task.entity';

@Injectable()
export class CreateTaskController {
  constructor(
    private readonly gateway: TaskGateway,
    private readonly usecase: CreateTaskUseCase,
  ) {}

  async execute(task: CreateTaskDto, userId: number): Promise<Task> {
    return await this.usecase.execute(this.gateway, task, userId);
  }
}
