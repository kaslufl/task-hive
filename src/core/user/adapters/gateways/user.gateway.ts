import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../external/repository/user.repository.interface';
import { RegisterUserDto } from '../../dto/register-user.dto';

@Injectable()
export class UserGateway {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(user: RegisterUserDto) {
    await this.userRepository.createUser(user);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }
}
