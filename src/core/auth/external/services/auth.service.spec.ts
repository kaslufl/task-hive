import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../../../user/entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { TokenDto } from '../../dto/token.dto';
import { PayloadTokenDto } from '../../dto/payload-token.dto';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a valid token', async () => {
      const user: User = { id: 1, email: 'test@example.com' } as User;
      const token = 'testToken';
      const expiresIn = '3600';
      process.env.JWT_EXPIRES_IN = expiresIn;

      jest.spyOn(service, 'generateToken').mockReturnValue(token);

      const result: TokenDto = await service.login(user);

      expect(result).toEqual({
        access_token: token,
        token_type: 'Bearer',
        expires_in: Number(expiresIn),
      });
    });
  });

  describe('validateUser', () => {
    it('should return true if passwords match', async () => {
      const password = 'password';
      const storedPassword = 'hashedPassword';

      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(password, storedPassword);

      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      const password = 'password';
      const storedPassword = 'hashedPassword';

      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(password, storedPassword);

      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should return a signed token', () => {
      const payload: PayloadTokenDto = { userId: 1, email: 'test@example.com' };
      const token = 'signedToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = service.generateToken(payload);

      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should return true', async () => {
      const token = 'testToken';

      const result = await service.verifyToken(token);

      expect(result).toBe(true);
    });
  });
});
