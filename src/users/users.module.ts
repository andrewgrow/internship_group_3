import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from './users.schema';
import { AppJwtModule } from '../security/jwt/app.jwt.module';
import { AppConfigModule } from '../config/app.config.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    AppJwtModule,
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
