import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppJwtModule } from '../jwt/app.jwt.module';

@Module({
  imports: [UsersModule, AppJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
