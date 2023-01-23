import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UpdateUserDto, UpdateUserValidationSchema } from '../dto/update.dto';

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
