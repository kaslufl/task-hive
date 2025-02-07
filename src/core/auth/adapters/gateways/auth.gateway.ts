import { Injectable } from '@nestjs/common';
import { IAuthService } from '../../external/services/auth.service.interface';
import { User } from '../../../user/entities/user.entity';

@Injectable()
export class AuthGateway {
  constructor(private readonly authService: IAuthService) {}

  async validateUser(password: string, storedPassword: string) {
    return this.authService.validateUser(password, storedPassword);
  }

  async login(user: User) {
    return this.authService.login(user);
  }

  async verifyToken(token: string) {
    return this.authService.verifyToken(token);
  }
}
