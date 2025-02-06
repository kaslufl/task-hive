import { Module } from '@nestjs/common';
import { UserGateway } from './adapters/gateways/user.gateway';
import { CreateUserController } from './adapters/controllers/create-user.controller';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { IUserRepository } from './external/repository/user.repository.interface';
import { UserRepository } from './external/repository/user.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { UserController } from './external/api/user.controller';

@Module({
  providers: [
    UserGateway,
    CreateUserController,
    CreateUserUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  imports: [DatabaseModule],
  exports: [UserGateway],
})
export class UserModule {}
