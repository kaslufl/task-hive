import { Prisma } from '@prisma/client';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { Task } from '../../entities/task.entity';
import { Task as TaskOrm } from '@prisma/client';

export abstract class ITaskRepository {
  abstract createTask(userId: number, task: CreateTaskDto): Promise<Task>;
  abstract getTaskById(id: number): Promise<Task | null>;
  abstract getTaskByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<TaskOrm | null>;
  abstract getTasks(
    page: number,
    limit: number,
    filters: Prisma.TaskWhereInput,
  ): Promise<{ data: Task[]; total: number }>;
  abstract updateTask(id: number, data: UpdateTaskDto): Promise<Task>;
  abstract deleteTask(id: number): Promise<void>;
}
