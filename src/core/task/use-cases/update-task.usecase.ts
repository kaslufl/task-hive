import { HttpException, HttpStatus } from '@nestjs/common';
import { TaskGateway } from '../adapters/gateways/task.gateway';
import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';

export class UpdateTaskUseCase {
  async execute(
    taskGateway: TaskGateway,
    taskId: number,
    userId: number,
    updatedData: UpdateTaskDto,
  ): Promise<Task> {
    const task = await taskGateway.getTaskByIdAndUserId(taskId, userId);

    if (!task) {
      throw new HttpException('Could not update', HttpStatus.BAD_REQUEST);
    }

    const updatedTask = { ...updatedData };
    return await taskGateway.updateTask(taskId, updatedTask);
  }
}
