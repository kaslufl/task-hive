import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({ default: 'test@test.com' })
  email: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ default: 'lucas' })
  name: string;

  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ default: 'changeme' })
  password: string;
}
