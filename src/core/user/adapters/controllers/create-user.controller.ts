import { Injectable } from '@nestjs/common';
import { UserGateway } from '../gateways/user.gateway';
import { CreateUserUseCase } from '../../use-cases/create-user.usecase';
import { RegisterUserDto } from '../../dto/register-user.dto';

@Injectable()
export class CreateUserController {
  constructor(
    private readonly gateway: UserGateway,
    private readonly usecase: CreateUserUseCase,
  ) {}

  async execute(user: RegisterUserDto): Promise<void> {
    await this.usecase.execute(this.gateway, user);
  }
}
