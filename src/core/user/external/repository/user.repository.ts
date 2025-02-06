import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../dto/register-user.dto';
import { IUserRepository } from './user.repository.interface';
import { User } from '../../entities/user.entity';
import { DatabaseService } from '../../../../infrastructure/database/database.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly database: DatabaseService) {}

  async createUser(user: RegisterUserDto) {
    await this.database.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  async getUserByEmail(email: string) {
    const user = await this.database.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    return new User(user.id, user.name, user.email, user.password);
  }
}
