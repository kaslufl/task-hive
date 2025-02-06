import { Test, TestingModule } from '@nestjs/testing';
import { UserGateway } from './user.gateway';
import { IUserRepository } from '../../external/repository/user.repository.interface';
import { RegisterUserDto } from '../../dto/register-user.dto';
import { UserRepository } from '../../external/repository/user.repository';
import { DatabaseService } from '../../../../infrastructure/database/database.service';

describe('UserGateway', () => {
  let userGateway: UserGateway;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserGateway,
        {
          provide: IUserRepository,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userGateway = module.get<UserGateway>(UserGateway);
    userRepository = module.get<UserRepository>(IUserRepository);
  });

  it('should be defined', () => {
    expect(userGateway).toBeDefined();
  });

  describe('createUser', () => {
    it('should call userRepository.createUser with correct parameters', async () => {
      const user: RegisterUserDto = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password',
      };
      await userGateway.createUser(user);
      expect(userRepository.createUser).toHaveBeenCalledWith(user);
    });
  });

  describe('getUserByEmail', () => {
    it('should call userRepository.getUserByEmail with correct parameters', async () => {
      const email = 'test@example.com';
      await userGateway.getUserByEmail(email);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should return the user from userRepository.getUserByEmail', async () => {
      const email = 'test@example.com';
      const user = { email, password: 'password' };
      (userRepository.getUserByEmail as jest.Mock).mockResolvedValue(user);
      const result = await userGateway.getUserByEmail(email);
      expect(result).toEqual(user);
    });
  });
});
