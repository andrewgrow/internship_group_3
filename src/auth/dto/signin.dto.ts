import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/users.schema';

export class SignInDto implements Partial<User> {
  @ApiProperty({
    description: 'The email of a user. Cannot be empty for sign in.',
    minimum: 5,
    maximum: 100,
    type: String,
    required: true,
    nullable: false,
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @Length(5, 100)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of a user. Cannot be empty for sign in.',
    minimum: 8,
    maximum: 1024,
    type: String,
    required: true,
    nullable: false,
    example: 'Qwerty78',
  })
  @IsString()
  @Length(8, 1024)
  password: string;
}
