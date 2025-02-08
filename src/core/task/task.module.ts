import { Module } from '@nestjs/common';
import { TaskController } from './external/api/task.controller';
import { TaskGateway } from './adapters/gateways/task.gateway';
import { CreateTaskController } from './adapters/controllers/create-task.controller';
import { GetTaskController } from './adapters/controllers/get-task-by-id.controller';
import { GetTasksController } from './adapters/controllers/get-tasks.controller';
import { UpdateTaskController } from './adapters/controllers/update-task.controller';
import { ITaskRepository } from './external/repository/task.repository.interface';
import { TaskRepository } from './external/repository/task.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { CreateTaskUseCase } from './use-cases/create-task.usecase';
import { GetTaskByIdUseCase } from './use-cases/get-task-by-id.usecase';
import { GetTasksUseCase } from './use-cases/get-tasks.usecase';
import { UpdateTaskUseCase } from './use-cases/update-task.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../../infrastructure/config/jwt.config';
import { DeleteTaskController } from './adapters/controllers/delete-task.controller';
import { DeleteTaskUseCase } from './use-cases/delete-task.usecase';

@Module({
  providers: [
    TaskGateway,
    CreateTaskController,
    GetTaskController,
    GetTasksController,
    UpdateTaskController,
    DeleteTaskController,
    CreateTaskUseCase,
    GetTaskByIdUseCase,
    GetTasksUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    {
      provide: ITaskRepository,
      useClass: TaskRepository,
    },
  ],
  controllers: [TaskController],
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: jwtConfig().secret,
        signOptions: { expiresIn: jwtConfig().expiresIn },
      }),
    }),
  ],
  exports: [],
})
export class TaskModule {}
