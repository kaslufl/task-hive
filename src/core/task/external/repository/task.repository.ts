import { Injectable } from '@nestjs/common';
import { ITaskRepository } from './task.repository.interface';
import { Task, TaskStatus } from '../../entities/task.entity';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { DatabaseService } from '../../../../infrastructure/database/database.service';
import { Prisma } from '@prisma/client';
import { Task as TaskOrm } from '@prisma/client';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(private readonly database: DatabaseService) {}

  async createTask(userId: number, task: CreateTaskDto): Promise<Task> {
    const created_task = await this.database.task.create({
      data: {
        userId: userId,
        title: task.title,
        description: task.description,
        status: task.status,
      },
    });

    return new Task(
      created_task.id,
      created_task.title,
      created_task.description,
      created_task.status as TaskStatus,
    );
  }

  async getTaskById(id: number): Promise<Task | null> {
    const task = await this.database.task.findUnique({
      where: {
        id: id,
      },
    });

    if (!task) {
      return null;
    }
    return new Task(
      task.id,
      task.title,
      task.description,
      task.status as TaskStatus,
    );
  }

  async getTaskByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<TaskOrm | null> {
    const task = await this.database.task.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!task) {
      return null;
    }
    return task;
  }

  async getTasks(
    page: number,
    limit: number,
    filters?: Prisma.TaskWhereInput,
  ): Promise<{ data: Task[]; total: number }> {
    const [tasks, total] = await Promise.all([
      this.database.task.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.database.task.count({ where: filters }),
    ]);

    const taskList = tasks.length
      ? tasks.map(
          (task) =>
            new Task(
              task.id,
              task.title,
              task.description,
              task.status as TaskStatus,
            ),
        )
      : [];

    return {
      data: taskList,
      total: total,
    };
  }

  async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    const updated_task = await this.database.task.update({
      where: { id: id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
      },
    });

    return new Task(
      updated_task.id,
      updated_task.title,
      updated_task.description,
      updated_task.status as TaskStatus,
    );
  }

  async deleteTask(id: number): Promise<void> {
    await this.database.task.delete({ where: { id: id } });
  }
}
