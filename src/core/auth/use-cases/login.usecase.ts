import { HttpException, Injectable } from '@nestjs/common';
import { UserGateway } from '../../user/adapters/gateways/user.gateway';
import { LoginDto } from '../dto/login-user.dto';
import { TokenDto } from '../dto/token.dto';
import { AuthGateway } from '../adapters/gateways/auth.gateway';

@Injectable()
export class LoginUseCase {
  async execute(
    authGateway: AuthGateway,
    userGateway: UserGateway,
    userData: LoginDto,
  ): Promise<TokenDto> {
    const user = await userGateway.getUserByEmail(userData.email);

    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    const validateUser = await authGateway.validateUser(
      userData.password,
      user.password,
    );

    if (!validateUser) {
      throw new HttpException('Invalid credentials', 401);
    }

    return await authGateway.login(user);
  }
}
