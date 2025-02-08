import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginController } from '../../adapters/controllers/login.controller';
import { LoginDto } from '../../dto/login-user.dto';
import { TokenDto } from '../../dto/token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginController: LoginController) {}

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login user',
    description: 'Login with the provided information',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUz...',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() login: LoginDto): Promise<TokenDto> {
    return await this.loginController.execute(login);
  }
}
