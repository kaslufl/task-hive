import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserController } from '../../adapters/controllers/create-user.controller';
import { RegisterUserDto } from '../../dto/register-user.dto';

@ApiTags('Sign Up')
@Controller('sign-up')
export class UserController {
  constructor(private readonly createUserController: CreateUserController) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with the provided information',
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createUser(@Body() user: RegisterUserDto): Promise<void> {
    await this.createUserController.execute(user);
  }
}
