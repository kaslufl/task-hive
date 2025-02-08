import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { UserGateway } from '../../../user/adapters/gateways/user.gateway';
import { AuthGateway } from '../gateways/auth.gateway';
import { LoginUseCase } from '../../use-cases/login.usecase';
import { LoginDto } from '../../dto/login-user.dto';
import { TokenDto } from '../../dto/token.dto';

describe('LoginController', () => {
  let controller: LoginController;
  let userGateway: UserGateway;
  let authGateway: AuthGateway;
  let loginUseCase: LoginUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({ token: 'test-token' }),
          },
        },
        {
          provide: UserGateway,
          useValue: jest.fn(),
        },
        {
          provide: AuthGateway,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    userGateway = module.get<UserGateway>(UserGateway);
    authGateway = module.get<AuthGateway>(AuthGateway);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a token on successful login', async () => {
    const loginData: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const result: TokenDto = await controller.execute(loginData);
    expect(result).toEqual({ token: 'test-token' });
    expect(loginUseCase.execute).toHaveBeenCalledWith(
      authGateway,
      userGateway,
      loginData,
    );
  });

  it('should call usecase.execute with correct parameters', async () => {
    const loginData: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    await controller.execute(loginData);
    expect(loginUseCase.execute).toHaveBeenCalledWith(
      authGateway,
      userGateway,
      loginData,
    );
  });

  it('should handle errors thrown by usecase.execute', async () => {
    const loginData: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    jest
      .spyOn(loginUseCase, 'execute')
      .mockRejectedValue(new Error('Login failed'));
    await expect(controller.execute(loginData)).rejects.toThrow('Login failed');
  });
});
