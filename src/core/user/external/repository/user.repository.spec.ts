import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { DatabaseService } from '../../../../infrastructure/database/database.service';
import { RegisterUserDto } from '../../dto/register-user.dto';
import { User } from '../../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IUserRepository,
          useClass: UserRepository,
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

    userRepository = module.get<UserRepository>(IUserRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userDto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      await userRepository.createUser(userDto);

      expect(databaseService.user.create).toHaveBeenCalledWith({
        data: {
          name: userDto.name,
          email: userDto.email,
          password: userDto.password,
        },
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'john.doe@example.com';
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        createdAt: new Date(),
      };

      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(user);

      const result = await userRepository.getUserByEmail(email);

      expect(result).toEqual(
        new User(user.id, user.name, user.email, user.password),
      );
      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null if user is not found', async () => {
      const email = 'john.doe@example.com';

      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);

      const result = await userRepository.getUserByEmail(email);

      expect(result).toBeNull();
      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });
});
