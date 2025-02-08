import { Module } from '@nestjs/common';
import { UserGateway } from '../user/adapters/gateways/user.gateway';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../../infrastructure/config/jwt.config';
import { AuthController } from './external/api/auth.controller';
import { AuthGateway } from './adapters/gateways/auth.gateway';
import { LoginController } from './adapters/controllers/login.controller';
import { LoginUseCase } from './use-cases/login.usecase';
import { IAuthService } from './external/services/auth.service.interface';
import { AuthService } from './external/services/auth.service';
import { IUserRepository } from '../user/external/repository/user.repository.interface';
import { UserRepository } from '../user/external/repository/user.repository';

@Module({
  providers: [
    AuthGateway,
    UserGateway,
    LoginController,
    LoginUseCase,
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: jwtConfig().secret,
        signOptions: { expiresIn: Number(jwtConfig().expiresIn) },
      }),
    }),
  ],
  exports: [],
})
export class AuthModule {}
