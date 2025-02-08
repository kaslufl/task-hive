import { JwtService } from '@nestjs/jwt';
import { IAuthService } from './auth.service.interface';
import { Injectable } from '@nestjs/common';
import { TokenDto } from '../../dto/token.dto';
import { PayloadTokenDto } from '../../dto/payload-token.dto';
import { User } from '../../../user/entities/user.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(user: User): Promise<TokenDto> {
    const oneHour = 3600;
    const expiresIn = Number(process.env.JWT_EXPIRES_IN) || oneHour;
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: Number(expiresIn),
    };
  }

  async validateUser(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    return await bcryptjs.compare(password, storedPassword);
  }

  generateToken(payload: PayloadTokenDto): string {
    return this.jwtService.sign(payload);
  }
}
