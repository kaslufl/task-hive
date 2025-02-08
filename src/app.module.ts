import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infrastructure/health/health.module';
import { UserModule } from './core/user/user.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './core/auth/auth.module';
import { TaskModule } from './core/task/task.module';

@Module({
  providers: [],
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    UserModule,
    DatabaseModule,
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
