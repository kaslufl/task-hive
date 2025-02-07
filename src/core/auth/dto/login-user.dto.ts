import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ default: 'your@email.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'password' })
  password: string;
}
