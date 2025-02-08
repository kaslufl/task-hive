import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { Optional } from '@nestjs/common';

export class UpdateTaskDto {
  @Optional()
  @MaxLength(255)
  @ApiProperty({ default: 'new title' })
  title: string;

  @Optional()
  @ApiProperty({ default: 'new description' })
  description: string;

  @Optional()
  @IsEnum(TaskStatus)
  @ApiProperty({ default: TaskStatus.IN_PROGRESS })
  status: TaskStatus;
}
