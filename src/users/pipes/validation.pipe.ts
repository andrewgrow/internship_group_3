import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto, CreateUserValidationSchema } from '../dto/create.dto';
import { UpdateUserDto, UpdateUserValidationSchema } from '../dto/update.dto';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform<CreateUserDto> {
  async transform(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const validationResult = CreateUserValidationSchema.validate(createUserDto);

    if (validationResult.error) {
      const { message } = validationResult.error;
      throw new BadRequestException(message);
    }

    return createUserDto;
  }
}

@Injectable()
export class UpdateUserValidationPipe implements PipeTransform<UpdateUserDto> {
  async transform(updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
    const validationResult = UpdateUserValidationSchema.validate(updateUserDto);

    if (validationResult.error) {
      const { message } = validationResult.error;
      throw new BadRequestException(message);
    }

    return updateUserDto;
  }
}
