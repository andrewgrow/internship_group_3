import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto, CreateUserValidationSchema } from '../dto/create.dto';

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
