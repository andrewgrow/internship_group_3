import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class UsersValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(errors, 'Validation failed');
    }
    return value;
  }

  /* eslint-disable @typescript-eslint/ban-types */
  /**
   * It's responsible for bypassing the validation step when the current argument being processed is a native JavaScript
   * type (these can't have validation decorators attached, so there's no reason to run them through the validation step).
   * @param metatype: ArgumentMetadata
   * @private have no access from outside
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
