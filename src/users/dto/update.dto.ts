import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../users.schema';
import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class UpdateUserDto implements Partial<User> {
  @ApiProperty({
    description: 'The email of a user. Not will update when empty.',
    minimum: 5,
    maximum: 100,
    type: String,
    required: false,
    nullable: true,
    example: 'user@example.com',
  })
  @IsOptional()
  @Length(5, 100)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The first name of a user. Not will update when empty.',
    minimum: 2,
    maximum: 200,
    type: String,
    required: false,
    nullable: true,
    example: 'John',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Length(2, 20)
  firstName?: string;

  @ApiProperty({
    description: 'The last name of a user. Not will update when empty.',
    minimum: 2,
    maximum: 200,
    type: String,
    required: false,
    nullable: true,
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @Length(2, 20)
  lastName?: string;

  @ApiProperty({
    description: 'The password of a user. Not will update when empty.',
    minimum: 8,
    maximum: 1024,
    type: String,
    required: false,
    nullable: true,
    example: 'Qwerty78',
  })
  @IsOptional()
  @IsString()
  @Length(8, 1024)
  password: string;
}

export const UpdateUserValidationSchema = Joi.object({
  email: Joi.string().email().min(5).max(100).lowercase(),
  password: Joi.string().min(8).max(1024),
  firstName: Joi.string().min(2).max(20),
  lastName: Joi.string().min(2).max(20),
});
