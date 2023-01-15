import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.dto';
import { ApiBody, ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { UpdateUserValidationPipe } from './pipes/validation.pipe';
import { AppJwtGuard } from '../security/jwt/app.jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { UserId } from '../security/jwt/app.jwt.decoder';

@ApiTags('Users')
@Controller('/users')
@UseGuards(AppJwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully found.',
  })
  async get(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully found.',
  })
  @ApiResponse({
    status: 404,
    description: `User with id not found.`,
  })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully patched.',
  })
  @ApiResponse({
    status: 404,
    description: `User with id not found.`,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check model arguments.',
  })
  update(
    @Param('id') id: string,
    @Body(UpdateUserValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: `User account not found for deleting.`,
  })
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({
    name: 'avatar',
    required: true,
    description: 'An image file',
  })
  @ApiResponse({
    status: 201,
    description: 'Successful uploaded.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check image file.',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      dest: './dist/tempFiles',
      preservePath: true,
    }),
  )
  @HttpCode(201)
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // A number of bytes limit. 2 megabytes see as 1024 * 1024 * 2
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    await this.usersService.uploadAvatar(file, userId);
    return {
      message:
        'Upload successful. ' +
        'After processing image will be available in your profile (a little bit later).',
    };
  }
}
