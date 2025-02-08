import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '../../external/repository/task.repository.interface';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskGateway {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async createTask(userId: number, task: CreateTaskDto) {
    return this.taskRepository.createTask(userId, task);
  }
  async getTaskById(id: number) {
    return this.taskRepository.getTaskById(id);
  }

  async getTaskByIdAndUserId(id: number, userId: number) {
    return this.taskRepository.getTaskByIdAndUserId(id, userId);
  }
  async getTasks(page: number, limit: number, filters: Prisma.TaskWhereInput) {
    return this.taskRepository.getTasks(page, limit, filters);
  }
  async updateTask(id: number, task: UpdateTaskDto) {
    return this.taskRepository.updateTask(id, task);
  }

  async deleteTask(id: number) {
    return this.taskRepository.deleteTask(id);
  }
}
