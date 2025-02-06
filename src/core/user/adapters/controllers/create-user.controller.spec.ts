import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserController } from './create-user.controller';
import { UserGateway } from '../gateways/user.gateway';
import { CreateUserUseCase } from '../../use-cases/create-user.usecase';
import { RegisterUserDto } from '../../dto/register-user.dto';

describe('CreateUserController', () => {
  let controller: CreateUserController;
  let gateway: UserGateway;
  let usecase: CreateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserController,
        {
          provide: UserGateway,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateUserController>(CreateUserController);
    gateway = module.get<UserGateway>(UserGateway);
    usecase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call usecase.execute with correct parameters', async () => {
    const user: RegisterUserDto = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
    };
    await controller.execute(user);
    expect(usecase.execute).toHaveBeenCalledWith(gateway, user);
  });

  it('should handle errors thrown by usecase.execute', async () => {
    const user: RegisterUserDto = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
    };
    jest.spyOn(usecase, 'execute').mockRejectedValue(new Error('Test error'));

    await expect(controller.execute(user)).rejects.toThrow('Test error');
  });
});
