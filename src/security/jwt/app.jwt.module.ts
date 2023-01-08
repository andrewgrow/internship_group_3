import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppJwtService } from './app.jwt.service';
import { AppJwtGuard } from './app.jwt.guard';

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
  imports: [JwtModule.registerAsync(jwtFactory)],
  providers: [AppJwtService, AppJwtGuard],
  exports: [AppJwtService, AppJwtGuard],
})
export class AppJwtModule {}
