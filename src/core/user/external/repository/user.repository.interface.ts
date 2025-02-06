import { RegisterUserDto } from '../../dto/register-user.dto';
import { User } from '../../entities/user.entity';

export abstract class IUserRepository {
  abstract createUser(user: RegisterUserDto): Promise<void>;
  abstract getUserByEmail(email: string): Promise<User | null>;
}
