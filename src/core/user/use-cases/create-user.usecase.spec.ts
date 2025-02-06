import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { UserGateway } from '../adapters/gateways/user.gateway';
import { RegisterUserDto } from '../dto/register-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { User } from '../entities/user.entity';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userGateway: UserGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserGateway,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userGateway = module.get<UserGateway>(UserGateway);
  });

  it('should be defined', () => {
    expect(createUserUseCase).toBeDefined();
  });

  it('should create a user successfully', async () => {
    const user: RegisterUserDto = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(userGateway, 'getUserByEmail').mockResolvedValue(null);
    jest.spyOn(userGateway, 'createUser').mockResolvedValue(undefined);
    (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword');

    await createUserUseCase.execute(userGateway, user);

    expect(userGateway.getUserByEmail).toHaveBeenCalledWith(user.email);
    expect(userGateway.createUser).toHaveBeenCalledWith({
      ...user,
      password: 'hashedPassword',
    });
  });

  it('should throw an error if user already exists', async () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(userGateway, 'getUserByEmail').mockResolvedValue(user);

    await expect(createUserUseCase.execute(userGateway, user)).rejects.toThrow(
      new HttpException('User already exists', HttpStatus.BAD_REQUEST),
    );

    expect(userGateway.getUserByEmail).toHaveBeenCalledWith(user.email);
    expect(userGateway.createUser).not.toHaveBeenCalled();
  });

  it('should hash the password before creating the user', async () => {
    const user: RegisterUserDto = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(userGateway, 'getUserByEmail').mockResolvedValue(null);
    jest.spyOn(userGateway, 'createUser').mockResolvedValue(undefined);
    (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword');

    await createUserUseCase.execute(userGateway, user);

    expect(bcryptjs.hash).toHaveBeenCalledWith(user.password, 10);
    expect(userGateway.createUser).toHaveBeenCalledWith({
      ...user,
      password: 'hashedPassword',
    });
  });
});
