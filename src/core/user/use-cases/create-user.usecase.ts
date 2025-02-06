import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserGateway } from '../adapters/gateways/user.gateway';
import { RegisterUserDto } from '../dto/register-user.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class CreateUserUseCase {
  async execute(
    userGateway: UserGateway,
    user: RegisterUserDto,
  ): Promise<void> {
    if (await userGateway.getUserByEmail(user.email)) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcryptjs.hash(user.password, 10);

    await userGateway.createUser({ ...user, password: hashedPassword });
  }
}
