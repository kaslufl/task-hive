import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ default: 'task title' })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'create a new task' })
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  @ApiProperty({ default: TaskStatus.PENDING })
  status: TaskStatus;
}
