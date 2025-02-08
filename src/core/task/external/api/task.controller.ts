import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskController } from '../../adapters/controllers/create-task.controller';
import { GetTaskController } from '../../adapters/controllers/get-task-by-id.controller';
import { GetTasksController } from '../../adapters/controllers/get-tasks.controller';
import { UpdateTaskController } from '../../adapters/controllers/update-task.controller';
import { Task, TaskStatus } from '../../entities/task.entity';
import { JwtAuthGuard } from '../../../../infrastructure/guards/jwt-auth.guard';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { Prisma } from '@prisma/client';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { DeleteTaskController } from '../../adapters/controllers/delete-task.controller';

@ApiTags('Task Management')
@Controller('tasks')
@ApiBearerAuth('access-token')
export class TaskController {
  constructor(
    private readonly createTaskController: CreateTaskController,
    private readonly getTaskByIdController: GetTaskController,
    private readonly getTasksController: GetTasksController,
    private readonly updateTaskController: UpdateTaskController,
    private readonly deleteTaskController: DeleteTaskController,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create new task',
    description: 'Create a new task for the user with the provided information',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    schema: {
      example: {
        id: 1,
        title: 'title',
        description: 'description',
        status: TaskStatus.PENDING,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createTask(@Body() task: CreateTaskDto, @Request() req): Promise<Task> {
    return await this.createTaskController.execute(task, req.user.userId);
  }

  @Get('/:idTask')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get a task by ID',
    description: 'Get a task by the provided ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Task found successfully',
    schema: {
      example: {
        id: 1,
        title: 'title',
        description: 'description',
        status: TaskStatus.PENDING,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Task not founded' })
  async getTaskById(@Param('idTask') idTask: number): Promise<Task> {
    return await this.getTaskByIdController.execute(idTask);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get tasks ',
    description: 'Get all tasks, can be filtered by status',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Page size',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Task status',
    enum: TaskStatus,
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks found successfully',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'title',
            description: 'description',
            status: TaskStatus.PENDING,
          },
        ],
        total: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Tasks not founded' })
  async getTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: TaskStatus,
  ): Promise<{ data: Task[]; total: number }> {
    const filters = {
      status: status ? { equals: status } : undefined,
    };
    return await this.getTasksController.execute(
      page,
      limit,
      filters as Prisma.TaskWhereInput,
    );
  }

  @Put('/:idTask')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get a task by ID',
    description: 'Get a task by the provided ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Task found successfully',
    schema: {
      example: {
        id: 1,
        title: 'title',
        description: 'description',
        status: TaskStatus.PENDING,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTask(
    @Param('idTask') idTask: number,
    @Body() task: UpdateTaskDto,
    @Request() req,
  ) {
    return await this.updateTaskController.execute(
      idTask,
      req.user.userId,
      task,
    );
  }

  @Delete('/:idTask')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a task by ID',
    description: 'Delete a task by the provided ID',
  })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteTask(@Param('idTask') idTask: number, @Request() req) {
    await this.deleteTaskController.execute(idTask, req.user.userId);
  }
}
