import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.usecase';
import { AuthGateway } from '../adapters/gateways/auth.gateway';
import { UserGateway } from '../../user/adapters/gateways/user.gateway';
import { LoginDto } from '../dto/login-user.dto';
import { TokenDto } from '../dto/token.dto';
import { HttpException } from '@nestjs/common';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let authGateway: AuthGateway;
  let userGateway: UserGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: AuthGateway,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: UserGateway,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    authGateway = module.get<AuthGateway>(AuthGateway);
    userGateway = module.get<UserGateway>(UserGateway);
  });

  it('should return a token if credentials are valid', async () => {
    const userData: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashedPassword',
    };
    const token: TokenDto = {
      access_token: 'token',
      token_type: '',
      expires_in: 0,
    };

    jest.spyOn(userGateway, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(authGateway, 'validateUser').mockResolvedValue(true);
    jest.spyOn(authGateway, 'login').mockResolvedValue(token);

    expect(await loginUseCase.execute(authGateway, userGateway, userData)).toBe(
      token,
    );
  });

  it('should throw an error if user is not found', async () => {
    const userData: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };

    jest.spyOn(userGateway, 'getUserByEmail').mockResolvedValue(null);

    await expect(
      loginUseCase.execute(authGateway, userGateway, userData),
    ).rejects.toThrow(new HttpException('Invalid credentials', 401));
  });

  it('should throw an error if password is invalid', async () => {
    const userData: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    jest.spyOn(userGateway, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(authGateway, 'validateUser').mockResolvedValue(false);

    await expect(
      loginUseCase.execute(authGateway, userGateway, userData),
    ).rejects.toThrow(new HttpException('Invalid credentials', 401));
  });
});
