import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../user/adapters/gateways/user.gateway';
import { AuthGateway } from '../gateways/auth.gateway';
import { LoginUseCase } from '../../use-cases/login.usecase';
import { LoginDto } from '../../dto/login-user.dto';
import { TokenDto } from '../../dto/token.dto';

@Injectable()
export class LoginController {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly authGateway: AuthGateway,
    private readonly usecase: LoginUseCase,
  ) {}

  async execute(loginData: LoginDto): Promise<TokenDto> {
    return await this.usecase.execute(
      this.authGateway,
      this.userGateway,
      loginData,
    );
  }
}
