import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('jwt.secret'),
    signOptions: {
      expiresIn: configService.get<string>('jwt.expiresInSeconds'),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [JwtModule.registerAsync(jwtFactory), UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
