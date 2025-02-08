import { Test, TestingModule } from '@nestjs/testing';
import { AuthGateway } from './auth.gateway';
import { IAuthService } from '../../external/services/auth.service.interface';
import { User } from '../../../user/entities/user.entity';

describe('AuthGateway', () => {
  let authGateway: AuthGateway;
  let authService: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGateway,
        {
          provide: IAuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authGateway = module.get<AuthGateway>(AuthGateway);
    authService = module.get<IAuthService>(IAuthService);
  });

  it('should be defined', () => {
    expect(authGateway).toBeDefined();
  });

  describe('validateUser', () => {
    it('should call authService.validateUser with correct parameters', async () => {
      const password = 'password';
      const storedPassword = 'storedPassword';
      await authGateway.validateUser(password, storedPassword);
      expect(authService.validateUser).toHaveBeenCalledWith(
        password,
        storedPassword,
      );
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const user = new User(
        1,
        'John Doe',
        'john.doe@example.com',
        'password123',
      );
      await authGateway.login(user);
      expect(authService.login).toHaveBeenCalledWith(user);
    });
  });
});
