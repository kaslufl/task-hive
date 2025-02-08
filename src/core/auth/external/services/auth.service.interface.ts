import { User } from '../../../user/entities/user.entity';
import { PayloadTokenDto } from '../../dto/payload-token.dto';
import { TokenDto } from '../../dto/token.dto';

export abstract class IAuthService {
  abstract login(user: User): Promise<TokenDto>;
  abstract validateUser(
    password: string,
    storedPassword: string,
  ): Promise<boolean>;
  abstract generateToken(payload: PayloadTokenDto, expiresIn: number): string;
}
